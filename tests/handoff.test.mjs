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
  figmaMakePrompt,
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

// The generator boundary must carry the method itself, not an unavailable file link.
test("all builder handoffs include the canonical design method and remain private drafts", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bcn-design-handoff-"));
  try {
    const out = path.join(dir, "exports");
    await writeHandoff({ brief: seed, root, outDir: out });
    const method = await readFile(
      path.join(root, "docs/designer-playbook.md"),
      "utf8",
    );
    for (const name of [
      "figma-make-prompt.md",
      "figma-prompt.md",
      "sites-prompt.md",
    ]) {
      const prompt = await readFile(path.join(out, name), "utf8");
      assert.ok(prompt.includes(method), name + " omitted the actual method");
      assert.ok(prompt.includes(seed.copy.ca.headline));
      assert.ok(prompt.includes(seed.copy.es.headline));
      assert.ok(prompt.includes(seed.copy.en.headline));
      assert.match(prompt, /"status": "draft"/);
    }
    assert.throws(
      () =>
        figmaMakePrompt(handoffContent(seed), designTokens("restaurant"), null),
      /design method is required/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
