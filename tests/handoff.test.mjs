import test from "node:test";
import assert from "node:assert/strict";
import {
  readFile,
  mkdtemp,
  mkdir,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import {
  handoffContent,
  writeHandoff,
  designTokens,
} from "../tools/handoff-lib.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seed = JSON.parse(
  await readFile(path.join(root, "site/brief.json"), "utf8"),
);
test("handoff cannot bypass live release checks and strips unexpected private fields", () => {
  const b = structuredClone(seed);
  b.status = "live";
  assert.throws(() => handoffContent(b), /approval|digest|origin/);
  b.status = "draft";
  b.business.internalNote = "SECRET";
  b.copy.ca.internalNote = "SECRET";
  b.catalog[0].internalNote = "SECRET";
  b.business.hours = [
    { days: [0, 1, 2, 3, 4, 5, 6], intervals: [], internalNote: "SECRET" },
  ];
  b.legal.ca.notice = "Public approved legal text";
  assert.doesNotMatch(JSON.stringify(handoffContent(b)), /SECRET/);
  assert.equal(handoffContent(b).legal.ca.notice, "Public approved legal text");
});
test("handoff creates usable draft prompt files and refuses unsafe output paths", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bcn-handoff-"));
  try {
    const out = path.join(dir, "exports");
    await writeHandoff({ brief: seed, root, outDir: out });
    const data = JSON.parse(
      await readFile(path.join(out, "content.json"), "utf8"),
    );
    assert.equal(data.status, "draft");
    assert.equal(data.sourceStatus, "demo");
    assert.match(
      await readFile(path.join(out, "sites-prompt.md"), "utf8"),
      /"ownerApproved": false/,
    );
    assert.equal(designTokens("barber").colors.accent, "#173d65");
    await symlink(out, path.join(dir, "link"));
    await assert.rejects(
      writeHandoff({ brief: seed, root, outDir: path.join(dir, "link") }),
      /symlink/,
    );
    const other = path.join(dir, "other");
    await mkdir(other);
    await writeFile(path.join(other, "keep"), "mine");
    await assert.rejects(
      writeHandoff({ brief: seed, root, outDir: other }),
      /without .generated/,
    );
    assert.equal(await readFile(path.join(other, "keep"), "utf8"), "mine");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
