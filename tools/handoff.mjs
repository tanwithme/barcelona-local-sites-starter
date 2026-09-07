import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeHandoff } from "./handoff-lib.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  const brief = JSON.parse(
    await readFile(path.join(root, "site/brief.json"), "utf8"),
  );
  await writeHandoff({ brief, root, outDir: path.join(root, "exports") });
  console.log(
    "Prepared Sites/Figma draft prompts, public content, design tokens and approved assets in exports/. Nothing uploaded or published.",
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
