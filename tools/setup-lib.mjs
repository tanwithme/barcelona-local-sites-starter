import {
  readFile,
  writeFile,
  mkdir,
  lstat,
  readdir,
  realpath,
  rename,
  rm,
  appendFile,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import os from "node:os";
const ID = "barcelona-local-sites-studio";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const languages = new Set(["ca", "es", "en"]);
const skillNames = [
  "bcn-site-coach",
  "bcn-business-copilot",
  "bcn-copy-design",
  "bcn-sites-handoff",
  "bcn-figma-handoff",
  "bcn-release-review",
];
export async function packageBytes(source) {
  const root = await realpath(source);
  const manifestFile = path.join(root, "starter-manifest.json");
  if ((await lstat(manifestFile)).isSymbolicLink())
    throw new Error("Package manifest cannot be a symlink");
  const manifestBytes = await readFile(manifestFile);
  const manifest = JSON.parse(manifestBytes);
  if (
    manifest.schemaVersion !== 1 ||
    manifest.name !== "barcelona-local-sites-starter" ||
    !Array.isArray(manifest.files) ||
    manifest.files.length < 10 ||
    manifest.files.length > 1000
  )
    throw new Error("Invalid starter package manifest");
  const files = new Map();
  const foldedPaths = new Set();
  for (const item of manifest.files) {
    const p = item.path;
    if (
      typeof p !== "string" ||
      p
        .split("/")
        .some(
          (part) =>
            !part ||
            part === "." ||
            part === ".." ||
            !/^[-A-Za-z0-9_. ]+$/.test(part),
        ) ||
      files.has(p) ||
      foldedPaths.has(p.toLowerCase()) ||
      !/^[a-f0-9]{64}$/.test(item.sha256 ?? "")
    )
      throw new Error("Invalid or duplicate package file");
    if (
      p === "starter-manifest.json" ||
      /(^|\/)(\.git|\.env|clients|private|exports|\.studio|\.starter-template)(\/|$)/.test(
        p,
      )
    )
      throw new Error("Private or generated file in package: " + p);
    let current = root;
    for (const part of p.split("/")) {
      current = path.join(current, part);
      if ((await lstat(current)).isSymbolicLink())
        throw new Error("Package files cannot use symlinks: " + p);
    }
    const info = await lstat(current);
    if (!info.isFile() || info.size > 5 * 1024 * 1024)
      throw new Error("Unexpected package file type or size: " + p);
    const bytes = await readFile(current);
    if (hash(bytes) !== item.sha256)
      throw new Error("Package changed or incomplete: " + p);
    files.set(p, bytes);
    foldedPaths.add(p.toLowerCase());
  }
  for (const p of [
    "AGENTS.md",
    "site/brief.json",
    "tools/build.mjs",
    "tools/handoff.mjs",
    ...skillNames.map((n) => ".agents/skills/" + n + "/SKILL.md"),
  ])
    if (!files.has(p)) throw new Error("Package missing " + p);
  files.set("starter-manifest.json", manifestBytes);
  return { files, manifest };
}
async function exists(file) {
  try {
    await lstat(file);
    return true;
  } catch (e) {
    if (e.code === "ENOENT") return false;
    throw e;
  }
}
async function safeFreshTarget(target) {
  const out = path.resolve(target);
  if (out === path.parse(out).root)
    throw new Error("Choose a new named project folder");
  const parent = path.dirname(out);
  await mkdir(parent, { recursive: true });
  if (await exists(out))
    throw new Error("Target exists; no files were overwritten: " + out);
  return out;
}
async function writeFiles(files, root) {
  for (const [relative, bytes] of files) {
    const dest = path.join(root, relative);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, bytes, { flag: "wx" });
  }
}
function runStep(root, file) {
  const result = spawnSync(process.execPath, [path.join(root, "tools", file)], {
    cwd: root,
    encoding: "utf8",
    timeout: 60000,
    maxBuffer: 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: "" },
  });
  if (result.status !== 0)
    throw new Error(
      file +
        " failed: " +
        (result.stderr || result.error?.message || "see setup output"),
    );
  return { command: "node tools/" + file, status: "passed" };
}
function copilot(language, project = "practice") {
  return `---\nlanguage: ${language}\nstage: practice\nproject: ${project}\nstatus: ready-to-start\n---\n\n# Our next useful step\n\nGoal: learn to deliver a useful Barcelona business website, then offer a small service you can maintain.\n\nCurrent work: a fictional practice. No real client facts or approval recorded.\n\nNext action: open the demo, choose one visitor question and improve one piece of copy.\n\nSuccess signal: someone can identify the offer and the next action without an explanation.\n\n## Decisions and open questions\n\nNo business commitments, purchases, messages or publication authorized by setup.\n\n## Last session\n\nSetup completed. The assistant should continue in ${language}, explain one step at a time and update this file after meaningful work. Keep notes brief and avoid private customer details.\n`;
}
async function seedNotes(root, language, project) {
  await writeFile(path.join(root, "COPILOT.md"), copilot(language, project), {
    flag: "wx",
  });
  await writeFile(
    path.join(root, "LESSONS.md"),
    "# Lessons from real attempts\n\nAdd only useful observations: expected → observed → smallest change → next check.\n",
    { flag: "wx" },
  );
  await mkdir(path.join(root, "private"), { recursive: true });
}
export async function installStudio({ source, target, language = "es" }) {
  if (!languages.has(language))
    throw new Error("Language must be ca, es or en");
  if (Number(process.versions.node.split(".")[0]) < 22)
    throw new Error(
      "Node.js 22+ is needed for the build. Use a supported runtime.",
    );
  const src = await realpath(source),
    out = path.resolve(target);
  if (
    out === src ||
    out.startsWith(src + path.sep) ||
    src.startsWith(out + path.sep)
  )
    throw new Error(
      "Install into a separate new folder, outside the downloaded source",
    );
  if (await exists(out)) {
    if ((await lstat(out)).isSymbolicLink())
      throw new Error("Target cannot be a symlink");
    const marker = path.join(out, ".studio/install.json");
    if (await exists(marker)) {
      if (
        (await lstat(path.join(out, ".studio"))).isSymbolicLink() ||
        (await lstat(marker)).isSymbolicLink()
      )
        throw new Error("Installation record cannot be a symlink");
      const info = JSON.parse(await readFile(marker, "utf8"));
      if (info.id === ID)
        return {
          state: "existing-preserved",
          path: out,
          version: info.version,
          next: "Read COPILOT.md and run npm run doctor; existing work was not overwritten.",
        };
    }
    throw new Error(
      "Target already exists; choose a different new folder. Nothing overwritten.",
    );
  }
  const { files, manifest } = await packageBytes(src);
  await safeFreshTarget(out);
  const staging = path.join(path.dirname(out), ".setup-" + randomUUID());
  await mkdir(staging);
  try {
    await writeFiles(files, staging);
    await writeFiles(files, path.join(staging, ".starter-template"));
    await seedNotes(staging, language, "practice");
    await mkdir(path.join(staging, "clients"));
    await mkdir(path.join(staging, ".studio"));
    await writeFile(
      path.join(staging, "CLIENTS.md"),
      "# Client work\n\nKeep project labels and next actions here; keep sensitive evidence in private files.\n\n| Project | Stage | Next action |\n| --- | --- | --- |\n",
    );
    const checks = [
      runStep(staging, "build.mjs"),
      runStep(staging, "handoff.mjs"),
    ];
    const receipt = {
      id: ID,
      schemaVersion: 1,
      version: manifest.version,
      language,
      installedAt: new Date().toISOString(),
      fileCount: files.size,
      skills: skillNames,
      checks,
      assistantDiscovery: "not-yet-confirmed",
      externalServices: "not-connected-by-setup",
    };
    await writeFile(
      path.join(staging, ".studio/install.json"),
      JSON.stringify(receipt, null, 2) + "\n",
    );
    if (await exists(out))
      throw new Error("Target appeared during setup; nothing overwritten");
    await rename(staging, out);
    return {
      state: "installed",
      path: out,
      version: manifest.version,
      checks,
      next: "Read AGENTS.md, COPILOT.md and bcn-business-copilot; run npm run doctor and open the demo.",
    };
  } catch (e) {
    await rm(staging, { recursive: true, force: true });
    throw e;
  }
}
export async function createClient({
  studio,
  slug,
  sector = "barber",
  language = "es",
}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? "") || slug.length > 60)
    throw new Error(
      "Use a short project label such as gracia-barber, without personal contact details",
    );
  if (
    !["restaurant", "barber", "trades"].includes(sector) ||
    !languages.has(language)
  )
    throw new Error("Choose restaurant, barber or trades and ca, es or en");
  const root = await realpath(studio);
  const marker = JSON.parse(
    await readFile(path.join(root, ".studio/install.json"), "utf8"),
  );
  if (marker.id !== ID)
    throw new Error("Run this from your installed studio folder");
  const clients = path.join(root, "clients");
  if ((await lstat(clients)).isSymbolicLink())
    throw new Error("Client directory cannot be a symlink");
  const { files } = await packageBytes(path.join(root, ".starter-template"));
  const out = await safeFreshTarget(path.join(clients, slug));
  const staging = path.join(clients, ".setup-" + randomUUID());
  await mkdir(staging);
  try {
    await writeFiles(files, staging);
    const brief = JSON.parse(files.get("examples/" + sector + ".json"));
    await writeFile(
      path.join(staging, "site/brief.json"),
      JSON.stringify(brief, null, 2) + "\n",
    );
    await seedNotes(staging, language, slug);
    await mkdir(path.join(staging, ".studio"));
    await writeFile(
      path.join(staging, ".studio/client.json"),
      JSON.stringify(
        {
          schemaVersion: 1,
          slug,
          sector,
          source: "starter-snapshot",
          status: "fictional-practice",
        },
        null,
        2,
      ) + "\n",
    );
    runStep(staging, "build.mjs");
    runStep(staging, "handoff.mjs");
    if (await exists(out))
      throw new Error("Project appeared during setup; nothing overwritten");
    await rename(staging, out);
  } catch (e) {
    await rm(staging, { recursive: true, force: true });
    throw e;
  }
  let registry = "not-updated";
  const registryPath = path.join(root, "CLIENTS.md");
  try {
    if (!(await lstat(registryPath)).isSymbolicLink()) {
      await appendFile(
        registryPath,
        `| [${slug}](clients/${slug}/COPILOT.md) | Fictional practice | Confirm owner need before real production |\n`,
      );
      registry = "updated";
    }
  } catch {}
  return {
    state: "created",
    path: out,
    registry,
    next: "This is a fictional seed. Obtain real facts, change status to draft and reset review before client production.",
  };
}
export function defaultTarget() {
  return path.join(os.homedir(), "Desktop", "Barcelona Sites Studio");
}
export async function inspectStudio(root) {
  const checks = [];
  for (const file of [
    "AGENTS.md",
    "COPILOT.md",
    "LESSONS.md",
    "dist/index.html",
    "exports/figma-make-prompt.md",
    ...skillNames.map((n) => ".agents/skills/" + n + "/SKILL.md"),
  ]) {
    const full = path.join(root, file);
    let ok = false;
    try {
      ok = (await lstat(full)).isFile() && (await readFile(full)).length > 0;
    } catch {}
    checks.push({ file, status: ok ? "passed" : "missing" });
  }
  const installed = await exists(path.join(root, ".studio/install.json"));
  const client = await exists(path.join(root, ".studio/client.json"));
  return {
    ready: checks.every((c) => c.status === "passed") && (installed || client),
    scope: installed ? "studio" : client ? "client" : "source-not-installed",
    checks,
    assistantDiscovery:
      "An assistant must read AGENTS.md and the selected skill in this folder; file presence alone does not prove loading.",
    externalServices:
      "Figma prompt export needs no connector. Accounts, publishing and Sites availability remain separate.",
  };
}
