import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateBrief } from "../src/site.mjs";
import { auditDiscovery } from "../src/discovery.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  const brief = JSON.parse(
    await readFile(path.join(root, "site/brief.json"), "utf8"),
  );
  const errors = validateBrief(brief, { release: brief.status === "live" });
  if (errors.length) throw new Error(errors.join("\n"));
  const files = new Map();
  for (const name of [
    "ca/index.html",
    "es/index.html",
    "en/index.html",
    "robots.txt",
    "sitemap.xml",
  ]) {
    try {
      files.set(name, await readFile(path.join(root, "dist", name), "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  const result = auditDiscovery(brief, files);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} catch (error) {
  console.error("Discovery check stopped: " + error.message);
  process.exitCode = 1;
}
