import test from "node:test";
import assert from "node:assert/strict";
import {
  readFile,
  writeFile,
  mkdtemp,
  mkdir,
  rm,
  symlink,
  readdir,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  installStudio,
  inspectStudio,
  createClient,
  packageBytes,
} from "../tools/setup-lib.mjs";
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = () => mkdtemp(path.join(os.tmpdir(), "bcn-setup-test-"));
async function fixture(dir) {
  const root = path.join(dir, "download");
  await mkdir(root);
  const { files } = await packageBytes(source);
  for (const [name, bytes] of files) {
    const dest = path.join(root, name);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, bytes);
  }
  return root;
}
test("fresh desktop-style setup produces a usable studio with all six skills and Make prompt", async () => {
  const dir = await temp();
  try {
    const target = path.join(dir, "Desktop", "Barcelona Sites Studio");
    const result = await installStudio({ source, target, language: "ca" });
    assert.equal(result.state, "installed");
    const doctor = await inspectStudio(target);
    assert.equal(doctor.ready, true);
    assert.equal(
      doctor.checks.filter((c) => c.file.includes("/SKILL.md")).length,
      6,
    );
    assert.match(
      await readFile(path.join(target, "COPILOT.md"), "utf8"),
      /language: ca/,
    );
    const make = await readFile(
      path.join(target, "exports/figma-make-prompt.md"),
      "utf8",
    );
    assert.match(make, /# Build this Barcelona business website/);
    assert.match(make, /#8b321b/);
    assert.match(make, /Català/);
    assert.match(make, /PRIVATE DRAFT/);
    const designMethod = await readFile(
      path.join(target, "docs/designer-playbook.md"),
      "utf8",
    );
    assert.ok(make.includes(designMethod));
    assert.ok((await readFile(path.join(target, "dist/index.html"))).length);
    assert.match(doctor.assistantDiscovery, /does not prove loading/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("repeating setup preserves notes and changed work; unrelated folders are never replaced", async () => {
  const dir = await temp();
  try {
    const target = path.join(dir, "studio");
    await installStudio({ source, target });
    await writeFile(path.join(target, "COPILOT.md"), "my actual progress");
    await writeFile(path.join(target, "site/brief.json"), "my unfinished edit");
    const result = await installStudio({ source, target, language: "en" });
    assert.equal(result.state, "existing-preserved");
    assert.equal(
      await readFile(path.join(target, "COPILOT.md"), "utf8"),
      "my actual progress",
    );
    assert.equal(
      await readFile(path.join(target, "site/brief.json"), "utf8"),
      "my unfinished edit",
    );
    const other = path.join(dir, "existing");
    await mkdir(other);
    await writeFile(path.join(other, "keep"), "mine");
    await assert.rejects(
      installStudio({ source, target: other }),
      /already exists/,
    );
    assert.equal(await readFile(path.join(other, "keep"), "utf8"), "mine");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("new clients use the original snapshot, not changed working facts or approvals", async () => {
  const dir = await temp();
  try {
    const studio = path.join(dir, "studio");
    await installStudio({ source, target: studio });
    const working = JSON.parse(
      await readFile(path.join(studio, "site/brief.json"), "utf8"),
    );
    working.business.name = "PRIVATE CLIENT";
    working.business.phone = "+34930000000";
    working.approvals.publication = true;
    await writeFile(
      path.join(studio, "site/brief.json"),
      JSON.stringify(working),
    );
    const result = await createClient({
      studio,
      slug: "gracia-barber",
      sector: "barber",
      language: "en",
    });
    const brief = JSON.parse(
      await readFile(path.join(result.path, "site/brief.json"), "utf8"),
    );
    assert.equal(brief.business.sector, "barber");
    assert.equal(brief.business.phone, null);
    assert.equal(brief.approvals.publication, false);
    assert.equal(brief.status, "demo");
    assert.doesNotMatch(JSON.stringify(brief), /PRIVATE CLIENT/);
    assert.equal((await inspectStudio(result.path)).ready, true);
    assert.match(
      await readFile(path.join(studio, "CLIENTS.md"), "utf8"),
      /gracia-barber/,
    );
    await assert.rejects(
      createClient({ studio, slug: "gracia-barber" }),
      /Target exists/,
    );
    await assert.rejects(
      createClient({ studio, slug: "../outside" }),
      /project label/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("altered package fails before output; source and target symlinks are rejected", async () => {
  const dir = await temp();
  try {
    const local = await fixture(dir);
    await writeFile(path.join(local, "AGENTS.md"), "changed");
    await assert.rejects(
      installStudio({ source: local, target: path.join(dir, "studio") }),
      /Package changed/,
    );
    await assert.rejects(readFile(path.join(dir, "studio", "AGENTS.md")));
    await rm(path.join(local, "AGENTS.md"));
    await symlink(
      path.join(source, "AGENTS.md"),
      path.join(local, "AGENTS.md"),
    );
    await assert.rejects(packageBytes(local), /symlinks/);
    const target = path.join(dir, "linked");
    await symlink(source, target);
    await assert.rejects(installStudio({ source, target }), /symlink/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("failed practice build leaves no partial installation", async () => {
  const dir = await temp();
  try {
    const local = await fixture(dir);
    const malformed = Buffer.from('{"schemaVersion":1}');
    await writeFile(path.join(local, "site/brief.json"), malformed);
    const manifest = JSON.parse(
      await readFile(path.join(local, "starter-manifest.json"), "utf8"),
    );
    manifest.files.find((f) => f.path === "site/brief.json").sha256 =
      createHash("sha256").update(malformed).digest("hex");
    await writeFile(
      path.join(local, "starter-manifest.json"),
      JSON.stringify(manifest),
    );
    await assert.rejects(
      installStudio({ source: local, target: path.join(dir, "studio") }),
      /build.mjs failed/,
    );
    assert.equal(
      (await readdir(dir)).some(
        (n) => n === "studio" || n.startsWith(".setup-"),
      ),
      false,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("invalid language and nested source installation stop before creating files", async () => {
  const dir = await temp();
  try {
    await assert.rejects(
      installStudio({
        source,
        target: path.join(dir, "studio"),
        language: "xx",
      }),
      /Language/,
    );
    await assert.rejects(
      installStudio({ source, target: path.join(source, "nested-test") }),
      /separate new folder/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("case-equivalent package paths are rejected before copying on any platform", async () => {
  const dir = await temp();
  try {
    const local = await fixture(dir);
    const manifest = JSON.parse(
      await readFile(path.join(local, "starter-manifest.json"), "utf8"),
    );
    const packageEntry = manifest.files.find((f) => f.path === "package.json");
    manifest.files.push({ ...packageEntry, path: "PACKAGE.JSON" });
    await writeFile(
      path.join(local, "starter-manifest.json"),
      JSON.stringify(manifest),
    );
    await assert.rejects(packageBytes(local), /duplicate package file/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
