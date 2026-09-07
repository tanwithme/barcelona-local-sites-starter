import http from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};
try {
  await stat(path.join(root, "index.html"));
} catch {
  console.error("Run npm run build first.");
  process.exit(1);
}
const server = http.createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = path.resolve(root, "." + p);
    if (file !== root && !file.startsWith(root + path.sep))
      throw new Error("Outside preview");
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    const resolved = await realpath(file);
    if (!resolved.startsWith((await realpath(root)) + path.sep))
      throw new Error("Outside preview");
    const bytes = await readFile(resolved);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});
server.listen(0, "127.0.0.1", () =>
  console.log(`Local preview: http://127.0.0.1:${server.address().port}/es/`),
);
for (const s of ["SIGINT", "SIGTERM"])
  process.on(s, () => server.close(() => process.exit(0)));
