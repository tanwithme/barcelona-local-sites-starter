import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildSite, validateBrief, contentDigest } from "../src/site.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const allowed = new Set(["--demo", "--release", "--release-check", "--brief"]);
let briefFile = path.join(root, "site/brief.json");
for (let i = 0; i < args.length; i++) {
  if (!allowed.has(args[i])) throw new Error("Unknown argument: " + args[i]);
  if (args[i] === "--brief") {
    if (!args[i + 1]) throw new Error("--brief requires a path");
    briefFile = path.resolve(args[++i]);
  }
}
try {
  const brief = JSON.parse(await readFile(briefFile, "utf8"));
  const release =
    args.includes("--release") || args.includes("--release-check");
  if (args.includes("--demo") && brief.status !== "demo")
    throw new Error("Committed demo must use fictional content");
  if (args.includes("--release-check")) {
    const errors = validateBrief(brief, { release: true });
    console.log("Current content digest: " + contentDigest(brief));
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(
      "Recorded release prerequisites passed. Verify the actual live destination after publishing.",
    );
  } else {
    const result = await buildSite({
      brief,
      root,
      outDir: path.join(root, args.includes("--demo") ? "demo" : "dist"),
      release,
    });
    console.log(
      `${brief.status === "demo" ? "Private practice draft" : "Build"}: ${result.files} files. No site was published.\nContent digest: ${result.digest}`,
    );
  }
} catch (error) {
  console.error("Build stopped:\n" + error.message);
  process.exitCode = 1;
}
