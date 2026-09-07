import { readFile, writeFile, readdir, lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../src/site.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const start = await readFile(path.join(root, "START-HERE.md"), "utf8");
const setup = await readFile(path.join(root, "SETUP-PROMPT.md"), "utf8");
const template = await readFile(path.join(root, "src/welcome.html"), "utf8");
const names = (await readdir(path.join(root, "prompts")))
  .filter((n) => n.endsWith(".md"))
  .sort();
const cards = [];
for (const name of names) {
  const text = await readFile(path.join(root, "prompts", name), "utf8");
  const title =
    text
      .split("\n")
      .find((l) => l.startsWith("# "))
      ?.slice(2) ?? name;
  cards.push(
    `<details><summary>${escapeHtml(title)}</summary><p><a href="prompts/${encodeURIComponent(name)}">Abrir archivo / Obre el fitxer / Open file</a></p><textarea readonly aria-label="${escapeHtml(title)}">${escapeHtml(text)}</textarea><button type="button" class="copy">Copiar prompt</button><span class="status" aria-live="polite"></span></details>`,
  );
}
if (!template.includes("__START__") || !template.includes("__CARDS__"))
  throw new Error("Welcome template is missing its content slots");
const out = path.join(root, "START HERE.html");
try {
  if ((await lstat(out)).isSymbolicLink())
    throw new Error("Welcome output cannot be a symlink");
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
await writeFile(
  out,
  template
    .replace("__START__", () => escapeHtml(start))
    .replace("__SETUP__", () => escapeHtml(setup))
    .replace("__CARDS__", () => cards.join("\n")),
);
console.log(`Built offline welcome and ${cards.length} task prompts.`);
