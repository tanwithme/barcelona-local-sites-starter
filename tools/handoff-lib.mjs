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
  files.set(
    "figma-make-prompt.md",
    figmaMakePrompt(content, designTokens(brief.business.sector), provenance),
  );
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

export function figmaMakePrompt(content, tokens, provenance) {
  return `# Build this Barcelona business website

Create a functional, responsive PRIVATE DRAFT website for the business described below. Use the supplied content as the source of truth. This is a website-building request for Figma Make; it requires no access to another chat, repository skill or connector.

## Visitor experience
- Help a visitor understand the offer and take one clear next action. Adapt composition to the actual business; do not turn every section into a card. For trades, show service area before the service list. For a restaurant or barber, make services/menu details easy to scan.
- Create complete ca/es/en language journeys with a visible Català · Español · English switch, matching facts/prices and appropriate document language. Use the exact supplied copy as draft text; do not invent native-speaker approval. Include legal/privacy pages in every language.
- Use the concrete colors and type choices below. Build mobile first; inspect 390, 768, 1024 and 1440px widths, long text, keyboard focus and contrast. Main actions should be easy to tap and the layout should remain useful without images.
- Use only the approved image files attached to this prompt. Asset paths below are filenames, not accessible URLs. If files are absent, omit the gallery and make a strong text-led layout. Never scrape Instagram or create fake business photos, reviews, awards, prices or qualifications.
- Build ordinary WhatsApp enquiry links only for a supplied verified international number. Encode the generic locale message. A message is not a confirmed booking. Provide the supplied phone fallback. If contacts are missing, show an inactive draft state, never a fake number or a working submit button.
- Use shared catalog prices. Null prices, missing hours or legal text remain visibly unresolved in this private draft; do not invent values. Keep the fictional/demo label when sourceStatus is demo. Do not describe real draft facts as approved just because a file supplied them.
- Prefer a static implementation with no forms, customer database, login, payments, live feeds, trackers or unnecessary remote fonts. Plain map/social links only when supplied. Noindex is useful for drafts but is not access control.
- Do not publish automatically. Return a reviewable preview, explain what works, list missing facts/assets and verify the language switch and primary action. A new renderer needs its own owner, legal and fluent-language review before release.

## Actual content

\`\`\`json
${JSON.stringify(content, null, 2)}
\`\`\`

## Design tokens

\`\`\`json
${JSON.stringify(tokens, null, 2)}
\`\`\`

## Optional draft provenance

${provenance ? "Include a clearly explained, removable tanwithme credit in this private draft. Public use requires owner agreement. Add a meta generator marker with exact lowercase tanwithme and, if arbitrary public files are supported, prepare /.well-known/tanwithme.json using this DRAFT declaration. Do not change it to live/approved until the new output is actually reviewed, its real canonical origin is known and owner approval is recorded. If that route cannot be served, report marker-only / unverified. Never track visitors or send reports.\n\n" + JSON.stringify(provenance, null, 2) : "Provenance is disabled. Do not add a visible credit, marker or public manifest."}
`;
}
