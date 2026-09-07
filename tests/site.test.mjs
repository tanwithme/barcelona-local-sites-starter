import test from "node:test";
import assert from "node:assert/strict";
import {
  readFile,
  mkdtemp,
  writeFile,
  mkdir,
  rm,
  symlink,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateBrief,
  renderSite,
  buildSite,
  contentDigest,
  whatsappLink,
} from "../src/site.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seed = JSON.parse(
  await readFile(path.join(root, "site/brief.json"), "utf8"),
);
const fresh = () => structuredClone(seed);
function live() {
  const b = fresh();
  b.status = "live";
  b.origin = "https://example.com";
  b.business.name = "Test fixture";
  b.business.phone = "+34930000000";
  b.business.address = "Test address";
  b.business.mapUrl = "https://maps.google.com/?q=test";
  b.business.byAppointment = true;
  for (const lang of ["ca", "es", "en"]) {
    b.copy[lang].intro = "Approved fixture content";
    b.copy[lang].visitBody = "Approved fixture";
    b.business.priceNote[lang] = "Prices on request";
    b.legal[lang] = { notice: "Test legal text", privacy: "Test privacy text" };
    b.approvals.locales[lang] = true;
  }
  for (const k of ["facts", "assets", "legal", "publication", "provenance"])
    b.approvals[k] = true;
  b.review = {
    version: "fixture-1",
    approvedVersion: "fixture-1",
    qaPassed: true,
    ownerHandoffReady: true,
    evidence: ["Synthetic fixture only, not real owner approval"],
  };
  b.review.approvedDigest = contentDigest(b);
  return b;
}
test("demo creates complete no-JS language and legal routes with non-live provenance", () => {
  assert.deepEqual(validateBrief(seed), []);
  const files = renderSite(seed);
  for (const l of ["ca", "es", "en"]) {
    const html = files.get(l + "/index.html");
    assert.ok(html.includes(`lang="${l}"`));
    assert.match(html, /noindex,nofollow/);
    assert.doesNotMatch(html, /<script\b/);
    assert.ok(files.has(l + "/legal.html"));
    assert.ok(files.has(l + "/privacy.html"));
    for (const target of ["ca", "es", "en"])
      assert.ok(html.includes(`../${target}/index.html`));
  }
  const marker = JSON.parse(files.get(".well-known/tanwithme.json"));
  assert.equal(marker.marker, "tanwithme");
  assert.equal(marker.ownerApproved, false);
  assert.equal(marker.status, "demo");
});
test("missing translations, duplicate prices and malformed shapes fail closed", () => {
  let b = fresh();
  delete b.copy.ca;
  assert.ok(validateBrief(b).length);
  b = fresh();
  b.copy.es.items[0].priceEUR = 10;
  assert.match(validateBrief(b).join(" "), /shared catalog/);
  for (const bad of [
    null,
    [],
    {},
    { ...fresh(), catalog: {} },
    { ...fresh(), assets: [null] },
  ])
    assert.ok(validateBrief(bad).length);
});
test("content is escaped and arbitrary schemes cannot become links", () => {
  const b = fresh();
  b.copy.es.headline = "<img src=x onerror=alert(1)>";
  assert.match(renderSite(b).get("es/index.html"), /&lt;img/);
  b.business.mapUrl = "javascript:alert(1)";
  assert.match(validateBrief(b).join(" "), /HTTPS/);
  assert.throws(() => renderSite(b));
});
test("generic WhatsApp message is encoded exactly, never silently normalises ambiguous numbers", () => {
  const link = whatsappLink("+34930000000", "Hola, què tal? & café");
  assert.equal(
    link,
    "https://wa.me/34930000000?text=" +
      encodeURIComponent("Hola, què tal? & café"),
  );
  assert.throws(() => whatsappLink("930000000", "hello"));
});
test("live status cannot bypass release checks through the default renderer", () => {
  const b = fresh();
  b.status = "live";
  assert.throws(() => renderSite(b), /approval|digest|review|origin/);
  assert.ok(validateBrief(seed, { release: true }).length);
});
test("approved synthetic live fixture passes, later fact change invalidates digest", () => {
  const b = live();
  assert.deepEqual(validateBrief(b, { release: true }), []);
  const files = renderSite(b);
  assert.match(files.get("es/index.html"), /index,follow/);
  assert.match(files.get("es/index.html"), /rel="canonical"/);
  assert.ok(files.has("sitemap.xml"));
  b.business.name = "Changed after review";
  assert.match(
    validateBrief(b, { release: true }).join(" "),
    /content changed/i,
  );
});
test("real draft remains noindex and is not described as fictional", () => {
  const b = fresh();
  b.status = "draft";
  const f = renderSite(b);
  assert.match(f.get("es/index.html"), /BORRADOR PRIVADO/);
  assert.match(f.get("index.html"), /noindex,nofollow/);
  assert.doesNotMatch(f.get("index.html"), /Not a real business/);
  assert.match(f.get("robots.txt"), /Disallow: \//);
});
test("disabling provenance removes files, metadata and footer credit", () => {
  const b = fresh();
  b.provenance.enabled = false;
  const f = renderSite(b);
  assert.equal(f.has(".well-known/tanwithme.json"), false);
  assert.equal(f.has("ca/provenance.html"), false);
  assert.doesNotMatch(f.get("ca/index.html"), /tanwithme|provenance/);
});
test("hours must cover all days and handle split opening hours explicitly", () => {
  const b = fresh();
  b.business.hours = [
    {
      days: [0, 1, 2, 3, 4],
      intervals: [
        ["09:00", "13:00"],
        ["16:00", "19:00"],
      ],
    },
    { days: [5, 6], intervals: [] },
  ];
  assert.deepEqual(validateBrief(b), []);
  assert.match(renderSite(b).get("ca/index.html"), /09:00–13:00 · 16:00–19:00/);
  b.business.hours.pop();
  assert.match(validateBrief(b).join(" "), /seven days/);
});
test("build replaces only its generated directory and does not retain removed provenance", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bcn-site-"));
  try {
    const out = path.join(dir, "dist");
    await buildSite({ brief: fresh(), root, outDir: out });
    const b = fresh();
    b.provenance.enabled = false;
    await buildSite({ brief: b, root, outDir: out });
    await assert.rejects(
      readFile(path.join(out, ".well-known/tanwithme.json")),
    );
    const protectedDir = path.join(dir, "private");
    await mkdir(protectedDir);
    await writeFile(path.join(protectedDir, "keep"), "mine");
    await assert.rejects(
      buildSite({ brief: b, root, outDir: protectedDir }),
      /without .generated/,
    );
    assert.equal(
      await readFile(path.join(protectedDir, "keep"), "utf8"),
      "mine",
    );
    await symlink(out, path.join(dir, "link"));
    await assert.rejects(
      buildSite({ brief: b, root, outDir: path.join(dir, "link") }),
      /symlink/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("failed asset build preserves prior good output", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bcn-failure-"));
  try {
    const out = path.join(dir, "dist");
    await buildSite({ brief: fresh(), root, outDir: out });
    const before = await readFile(path.join(out, "es/index.html"), "utf8");
    const b = fresh();
    b.assets = [
      {
        file: "missing.jpg",
        approved: true,
        rights: "fixture",
        alt: { ca: "prova", es: "prueba", en: "test" },
      },
    ];
    await assert.rejects(buildSite({ brief: b, root, outDir: out }));
    assert.equal(
      await readFile(path.join(out, "es/index.html"), "utf8"),
      before,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("midnight endings are explicit; private origins never become release canonicals", () => {
  const b = fresh();
  b.business.hours = [
    { days: [0, 1, 2, 3, 4, 5, 6], intervals: [["19:00", "24:00"]] },
  ];
  assert.deepEqual(validateBrief(b), []);
  for (const origin of [
    "https://127.0.0.1",
    "https://[::1]",
    "https://foo.local",
    "https://foo.internal",
  ]) {
    b.origin = origin;
    assert.match(validateBrief(b).join(" "), /origin/);
  }
});
test("reviewed image bytes must match their digest and failure preserves output", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bcn-image-"));
  try {
    await mkdir(path.join(dir, "src"));
    await writeFile(path.join(dir, "src/site.css"), "body{}");
    await mkdir(path.join(dir, "site/assets"), { recursive: true });
    const bytes = Buffer.from("test raster fixture");
    const { createHash } = await import("node:crypto");
    const asset = {
      file: "fixture.png",
      approved: true,
      rights: "synthetic test fixture",
      sha256: createHash("sha256").update(bytes).digest("hex"),
      alt: { ca: "prova", es: "prueba", en: "test" },
    };
    await writeFile(path.join(dir, "site/assets/fixture.png"), bytes);
    const b = fresh();
    b.assets = [asset];
    const out = path.join(dir, "dist");
    await buildSite({ brief: b, root: dir, outDir: out });
    assert.deepEqual(
      await readFile(path.join(out, "assets/fixture.png")),
      bytes,
    );
    await writeFile(path.join(dir, "site/assets/fixture.png"), "changed");
    await assert.rejects(
      buildSite({ brief: b, root: dir, outDir: out }),
      /bytes changed/,
    );
    assert.deepEqual(
      await readFile(path.join(out, "assets/fixture.png")),
      bytes,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("each supplied sector remains buildable with the intended section order", async () => {
  for (const sector of ["restaurant", "barber", "trades"]) {
    const brief = JSON.parse(
      await readFile(path.join(root, "examples", sector + ".json"), "utf8"),
    );
    assert.deepEqual(validateBrief(brief), []);
    const page = renderSite(brief).get("es/index.html");
    assert.ok(page.includes('data-sector="' + sector + '"'));
    if (sector === "trades") {
      assert.ok(page.indexOf('id="visit"') < page.indexOf('id="services"'));
      assert.match(page, /Zona de servicio/);
    } else
      assert.ok(page.indexOf('id="services"') < page.indexOf('id="visit"'));
  }
});
