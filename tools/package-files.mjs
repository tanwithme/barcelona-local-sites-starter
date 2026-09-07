import { readFile, writeFile, readdir, lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = [
  ".agents",
  ".github",
  "docs",
  "examples",
  "prompts",
  "src",
  "templates",
  "tests",
  "tools",
  "demo",
];
const singles = [
  "AGENTS.md",
  "INSTALL.md",
  "SETUP-PROMPT.md",
  "README.md",
  "README.ca.md",
  "README.en.md",
  "START-HERE.md",
  "START HERE.html",
  "CONTRIBUTING.md",
  "SUPPORT.md",
  "LICENSE",
  "package.json",
  ".gitignore",
  ".gitattributes",
  ".openai/hosting.example.json",
  "site/brief.json",
];
const files = [];
async function add(relative) {
  const info = await lstat(path.join(root, relative));
  if (info.isSymbolicLink())
    throw new Error("Package sources cannot be symlinks: " + relative);
  if (info.isDirectory()) {
    for (const name of (await readdir(path.join(root, relative))).sort())
      await add(relative + "/" + name);
  } else if (info.isFile()) {
    const bytes = await readFile(path.join(root, relative));
    files.push({
      path: relative,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
}
const seed = JSON.parse(
  await readFile(path.join(root, "site/brief.json"), "utf8"),
);
if (
  seed.status !== "demo" ||
  seed.assets.length ||
  seed.business.phone ||
  seed.business.whatsapp ||
  seed.origin
)
  throw new Error(
    "Only the fictional contact-free starter can be packaged. Do not package a client workspace.",
  );
for (const name of [...singles, ...roots]) await add(name);
files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
await writeFile(
  path.join(root, "starter-manifest.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      name: "barcelona-local-sites-starter",
      version: JSON.parse(
        await readFile(path.join(root, "package.json"), "utf8"),
      ).version,
      files,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Prepared package manifest for " +
    files.length +
    " public starter files. Hashes detect changes, not author identity.",
);
