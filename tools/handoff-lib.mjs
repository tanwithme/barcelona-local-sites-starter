import {
  readFile,
  writeFile,
  mkdir,
  lstat,
  stat,
  realpath,
  rename,
  rm,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { validateBrief, contentDigest, LANGUAGES } from "../src/site.mjs";
import { createProvenance } from "./provenance.mjs";

const pick = (obj, fields) =>
  Object.fromEntries(fields.map((k) => [k, obj[k]]));
export function handoffContent(brief) {
  const errors = validateBrief(brief, { release: brief.status === "live" });
  if (errors.length) throw new Error(errors.join("\n"));
  return {
    sourceStatus: brief.status,
    status: "draft",
    business: {
      ...pick(brief.business, [
        "name",
        "sector",
        "neighbourhood",
        "city",
        "address",
        "phone",
        "whatsapp",
        "mapUrl",
        "instagramUrl",
        "visitMode",
        "byAppointment",
      ]),
      priceNote: pick(brief.business.priceNote, LANGUAGES),
      hours: brief.business.hours.map((r) => ({
        days: [...r.days],
        intervals: r.intervals.map((v) => [...v]),
      })),
    },
    catalog: brief.catalog.map((i) => pick(i, ["id", "priceEUR"])),
    copy: Object.fromEntries(
      LANGUAGES.map((l) => [
        l,
        {
          ...pick(brief.copy[l], [
            "eyebrow",
            "headline",
            "intro",
            "sectionTitle",
            "visitTitle",
            "visitBody",
            "contactTitle",
            "contactBody",
            "cta",
            "message",
          ]),
          items: brief.copy[l].items.map((i) =>
            pick(i, ["id", "name", "description"]),
          ),
        },
      ]),
    ),
    legal: Object.fromEntries(
      LANGUAGES.map((l) => [
        l,
        {
          notice: brief.legal?.[l]?.notice ?? null,
          privacy: brief.legal?.[l]?.privacy ?? null,
        },
      ]),
    ),
    assets: brief.assets.map((a) => ({
      file: a.file,
      alt: pick(a.alt, LANGUAGES),
      approved: a.approved,
      sha256: a.sha256 ?? null,
    })),
  };
}
export function designTokens(sector) {
  const base = {
    page: "#fffaf3",
    text: "#24241f",
    muted: "#62564b",
    accent: "#8b321b",
    onAccent: "#ffffff",
    surface: "#f2e5d2",
    border: "#95836f",
    focus: "#0046a8",
  };
  const variants = {
    restaurant: {},
    barber: {
      page: "#f5f5f0",
      text: "#152332",
      muted: "#4e5c69",
      accent: "#173d65",
      surface: "#e1e8eb",
      border: "#788895",
    },
    trades: {
      page: "#f4f8f4",
      text: "#163b2d",
      muted: "#476454",
      accent: "#1b513b",
      surface: "#dfebe1",
      border: "#758d7c",
    },
  };
  return {
    source: "tanwithme",
    sector,
    colors: { ...base, ...variants[sector] },
    fonts: {
      body: "system-ui",
      display: sector === "restaurant" ? "Georgia" : "system-ui",
    },
    layout: {
      viewports: [390, 768, 1024, 1440],
      bodyText: 17,
      touchTarget: 48,
      maxImages: 6,
    },
    cssSource: "src/site.css",
    rules: [
      "ca/es/en complete language pages",
      "one shared set of facts and prices",
      "core action works without JavaScript",
      "no fabricated evidence",
    ],
  };
}
export async function writeHandoff({ brief, root, outDir }) {
  const content = handoffContent(brief),
    files = new Map();
  for (const asset of content.assets) {
    const base = await realpath(path.join(root, "site/assets"));
    const resolved = await realpath(path.join(base, asset.file));
    if (!resolved.startsWith(base + path.sep))
      throw new Error("Asset escapes asset directory");
    if ((await stat(resolved)).size > 3 * 1024 * 1024)
      throw new Error("Image exceeds 3 MB; resize it first");
    const bytes = await readFile(resolved),
      digest = createHash("sha256").update(bytes).digest("hex");
    if (asset.sha256 && asset.sha256 !== digest)
      throw new Error("Asset bytes changed after review: " + asset.file);
    asset.sha256 = digest;
    files.set("assets/" + asset.file, bytes);
  }
  // A new builder creates a new draft. Source approval cannot certify its output.
  const provenance = createProvenance({
    ...brief,
    status: "draft",
    approvals: { ...brief.approvals, provenance: false },
  });
  const intro = `# Project handoff\n\nSource: tanwithme / barcelona-local-sites-starter.\nSource content digest: ${contentDigest(brief)}. Source status: ${brief.status}. New builder status: draft.\n\nThese are content and working instructions, not credentials or publication permission. Confirm actual files and tools. Preserve shared facts/prices across ca/es/en. Use only the supplied, rights-cleared images. Never invent claims or contact details. Keep unknowns inactive. A new tool creates a new draft: recheck the actual output, native language copy, rights, legal text, owner control and publication approval. Private approval evidence stays outside this export; approved flags are recorded assertions, not identity proof.\n\n`;
  for (const [target, prompt] of [
    ["sites-prompt.md", "05-sites.md"],
    ["figma-prompt.md", "06-figma.md"],
  ]) {
    const instructions = await readFile(
      path.join(root, "prompts", prompt),
      "utf8",
    );
    files.set(
      target,
      intro +
        instructions +
        "\n\n## Content for this draft\n\n```json\n" +
        JSON.stringify(content, null, 2) +
        "\n```\n\n## Draft provenance\n\n```json\n" +
        JSON.stringify(provenance, null, 2) +
        "\n```\n\nPrompt text alone does not put metadata in a published website. If provenance is enabled, disclose it and serve /.well-known/tanwithme.json only after owner agreement. Rebuild the manifest with the real new canonical origin, live status and recorded owner approval only when this new output passes review. If the platform cannot serve the route, report marker-only / unverified. Never add tracking.\n",
    );
  }
  files.set("content.json", JSON.stringify(content, null, 2) + "\n");
  files.set(
    "design-tokens.json",
    JSON.stringify(designTokens(brief.business.sector), null, 2) + "\n",
  );
  files.set(".generated", "barcelona-local-sites-starter handoff\n");
  const out = path.resolve(outDir),
    parent = path.dirname(out);
  await mkdir(parent, { recursive: true });
  try {
    const info = await lstat(out);
    if (info.isSymbolicLink()) throw new Error("Output cannot be a symlink");
    await stat(path.join(out, ".generated"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    try {
      await stat(out);
      throw new Error("Refusing to replace a folder without .generated");
    } catch (inner) {
      if (inner.code !== "ENOENT") throw inner;
    }
  }
  const staging = path.join(
      parent,
      `.build-${path.basename(out)}-${process.pid}`,
    ),
    backup = path.join(parent, `.backup-${path.basename(out)}-${process.pid}`);
  await mkdir(staging, { recursive: false });
  let moved = false;
  try {
    for (const [file, bytes] of files) {
      const dest = path.join(staging, file);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, bytes);
    }
    try {
      await rename(out, backup);
      moved = true;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    await rename(staging, out);
    if (moved) await rm(backup, { recursive: true });
  } catch (e) {
    await rm(staging, { recursive: true, force: true });
    if (moved) {
      try {
        await stat(out);
      } catch {
        await rename(backup, out);
      }
    }
    throw e;
  }
  return { outDir: out, files: files.size };
}
