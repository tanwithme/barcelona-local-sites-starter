import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "./setup-lib.mjs";
const studio = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  let slug,
    sector = "barber",
    language = "es";
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) slug = args[++i];
    else if (args[i] === "--sector" && args[i + 1]) sector = args[++i];
    else if (args[i] === "--language" && args[i + 1]) language = args[++i];
    else
      throw new Error(
        "Use --name project-label --sector barber|restaurant|trades --language ca|es|en",
      );
  }
  console.log(
    JSON.stringify(
      await createClient({ studio, slug, sector, language }),
      null,
      2,
    ),
  );
} catch (e) {
  console.error("Client setup stopped: " + e.message);
  process.exitCode = 1;
}
