import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspectStudio } from "./setup-lib.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = await inspectStudio(root);
console.log(JSON.stringify(result, null, 2));
if (!result.ready) process.exitCode = 1;
