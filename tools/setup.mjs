import path from "node:path";
import { fileURLToPath } from "node:url";
import { installStudio, defaultTarget } from "./setup-lib.mjs";
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  let target = defaultTarget(),
    language = "es";
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--target" && args[i + 1]) target = path.resolve(args[++i]);
    else if (args[i] === "--language" && args[i + 1]) language = args[++i];
    else throw new Error('Use --target "new folder" and --language ca|es|en');
  }
  console.log(
    JSON.stringify(await installStudio({ source, target, language }), null, 2),
  );
} catch (e) {
  console.error("Setup stopped: " + e.message);
  process.exitCode = 1;
}
