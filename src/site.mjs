import {
  readFile,
  writeFile,
  mkdir,
  stat,
  lstat,
  realpath,
  rename,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { createProvenance } from "../tools/provenance.mjs";

export const LANGUAGES = ["ca", "es", "en"];
const labels = {
  ca: {
    lang: "Català",
    demo: "DEMOSTRACIÓ · No és un negoci real",
    skip: "Ves al contingut",
    nav: "Idiomes",
    services: "Serveis",
    hours: "Horari",
    location: "On som",
    phone: "Truca",
    directions: "Com arribar-hi",
    pending: "Pendent de confirmar",
    inactive: "Contacte pendent de confirmar",
    legal: "Avís legal",
    privacy: "Privacitat",
    closed: "Tancat",
    appointment: "Només amb cita prèvia",
    price: "Preu a consultar",
    home: "Inici",
    provenance: "Fet amb el pack tanwithme",
    explain:
      "Aquest web fa servir el pack tanwithme. La marca pública identifica el pack; no recull dades dels visitants ni certifica la qualitat del negoci.",
    proof: "Procedència",
    image: "Imatge del negoci",
  },
  es: {
    lang: "Español",
    demo: "DEMOSTRACIÓN · No es un negocio real",
    skip: "Ir al contenido",
    nav: "Idiomas",
    services: "Servicios",
    hours: "Horario",
    location: "Dónde estamos",
    phone: "Llamar",
    directions: "Cómo llegar",
    pending: "Pendiente de confirmar",
    inactive: "Contacto pendiente de confirmar",
    legal: "Aviso legal",
    privacy: "Privacidad",
    closed: "Cerrado",
    appointment: "Solo con cita previa",
    price: "Precio a consultar",
    home: "Inicio",
    provenance: "Hecho con el pack tanwithme",
    explain:
      "Esta web utiliza el pack tanwithme. La marca pública identifica el pack; no recoge datos de visitantes ni certifica la calidad del negocio.",
    proof: "Procedencia",
    image: "Imagen del negocio",
  },
  en: {
    lang: "English",
    demo: "DEMO · Not a real business",
    skip: "Skip to content",
    nav: "Languages",
    services: "Services",
    hours: "Opening hours",
    location: "Find us",
    phone: "Call",
    directions: "Directions",
    pending: "Awaiting confirmation",
    inactive: "Contact details awaiting confirmation",
    legal: "Legal notice",
    privacy: "Privacy",
    closed: "Closed",
    appointment: "By appointment only",
    price: "Ask for the price",
    home: "Home",
    provenance: "Made with the tanwithme starter",
    explain:
      "This website uses the tanwithme starter. The public marker identifies the starter; it does not collect visitor data or certify the business’s quality.",
    proof: "Provenance",
    image: "Business image",
  },
};
export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const nonempty = (v) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= 12000;
export function safeHttps(value, { originOnly = false } = {}) {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      !u.hash &&
      (!originOnly || u.origin === value) &&
      !isIP(u.hostname.replace(/^\[|\]$/g, "")) &&
      !/(^localhost$|\.(local|localhost|internal|test|invalid)$)/i.test(
        u.hostname,
      ) &&
      u.hostname.includes(".")
    );
  } catch {
    return false;
  }
}
export function contentDigest(brief) {
  const { review, ...content } = brief;
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}
export function validateBrief(brief, { release = false } = {}) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  if (!brief || typeof brief !== "object" || Array.isArray(brief))
    return ["brief must be an object"];
  check(brief.schemaVersion === 1, "schemaVersion must be 1");
  check(
    ["demo", "draft", "live"].includes(brief.status),
    "status must be demo, draft or live",
  );
  check(
    brief.origin === null || safeHttps(brief.origin, { originOnly: true }),
    "origin must be null or an HTTPS origin with no path, port or credentials",
  );
  const b = brief.business ?? {};
  if (
    !b ||
    typeof b !== "object" ||
    !Array.isArray(b.hours) ||
    !Array.isArray(brief.catalog) ||
    !Array.isArray(brief.assets) ||
    !brief.copy ||
    typeof brief.copy !== "object"
  )
    return [
      "business/hours, catalog, assets and copy must follow the supplied JSON shape",
    ];
  if (
    b.hours.some(
      (r) => !r || !Array.isArray(r.days) || !Array.isArray(r.intervals),
    ) ||
    brief.catalog.some((i) => !i || typeof i !== "object") ||
    brief.assets.some((a) => !a || typeof a !== "object") ||
    LANGUAGES.some(
      (l) =>
        !brief.copy[l] ||
        !Array.isArray(brief.copy[l].items) ||
        brief.copy[l].items.some((i) => !i || typeof i !== "object"),
    )
  )
    return [
      "hours rows, assets and all three language catalogs must follow the supplied JSON shape",
    ];
  check(nonempty(b.name), "business.name is required");
  check(
    ["restaurant", "barber", "trades"].includes(b.sector),
    "sector must be restaurant, barber or trades",
  );
  check(
    b.city === "Barcelona",
    "this starter targets Barcelona; adapt the schema and research for another city",
  );
  check(nonempty(b.neighbourhood), "neighbourhood is required");
  check(
    ["premises", "service-area"].includes(b.visitMode),
    "visitMode must be premises or service-area",
  );
  check(
    typeof b.byAppointment === "boolean",
    "byAppointment must be true or false",
  );
  for (const field of ["phone", "whatsapp"])
    check(
      b[field] === null || /^\+[1-9]\d{7,14}$/.test(b[field] ?? ""),
      `${field} must be null or a verified +countrycode international number`,
    );
  for (const field of ["mapUrl", "instagramUrl"])
    check(
      b[field] === null || safeHttps(b[field]),
      `${field} must be null or HTTPS without credentials`,
    );
  check(Array.isArray(b.hours), "hours must be an array");
  const covered = new Set();
  for (const row of Array.isArray(b.hours) ? b.hours : []) {
    check(
      Array.isArray(row.days) && row.days.length > 0,
      "hours rows need days (0 Monday through 6 Sunday)",
    );
    for (const day of row.days ?? []) {
      check(
        Number.isInteger(day) && day >= 0 && day <= 6 && !covered.has(day),
        "each weekday must appear at most once",
      );
      covered.add(day);
    }
    check(
      Array.isArray(row.intervals),
      "hours intervals must be an array; [] means explicitly closed",
    );
    let last = -1;
    for (const interval of row.intervals ?? []) {
      const valid =
        Array.isArray(interval) &&
        interval.length === 2 &&
        interval.every(
          (t, i) =>
            typeof t === "string" &&
            (/^([01]\d|2[0-3]):[0-5]\d$/.test(t) || (i === 1 && t === "24:00")),
        );
      check(valid, "hours intervals need valid HH:MM values");
      if (valid) {
        const minute = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
        const start = minute(interval[0]),
          end = minute(interval[1]);
        check(
          start < end && start >= last,
          "hours intervals must be ordered without overlap; split overnight hours across days",
        );
        last = end;
      }
    }
  }
  if (covered.size > 0)
    check(
      covered.size === 7,
      "hours must cover all seven days; do not infer missing days as closed",
    );
  check(
    Array.isArray(brief.catalog) &&
      brief.catalog.length > 0 &&
      brief.catalog.length <= 30,
    "catalog must contain 1–30 items",
  );
  const ids = (brief.catalog ?? []).map((x) => x.id);
  check(new Set(ids).size === ids.length, "catalog IDs must be unique");
  for (const item of brief.catalog ?? []) {
    check(
      typeof item.id === "string" && /^[a-z0-9-]+$/.test(item.id),
      "catalog IDs use lowercase letters, digits and hyphens",
    );
    check(
      item.priceEUR === null ||
        (Number.isFinite(item.priceEUR) && item.priceEUR >= 0),
      "prices must be null or nonnegative EUR amounts",
    );
  }
  const fields = [
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
  ];
  for (const lang of LANGUAGES) {
    const c = brief.copy?.[lang] ?? {};
    for (const f of fields)
      check(nonempty(c[f]), `copy.${lang}.${f} is required`);
    check(nonempty(b.priceNote?.[lang]), `priceNote.${lang} is required`);
    check(
      Array.isArray(c.items) && c.items.length === ids.length,
      `${lang} needs the same catalog items`,
    );
    check(
      (c.items ?? []).map((x) => x.id).join("|") === ids.join("|"),
      `${lang} item IDs/order must match shared catalog`,
    );
    for (const item of c.items ?? []) {
      check(
        nonempty(item.name) && nonempty(item.description),
        `${lang} catalog name and description required`,
      );
      check(
        !("priceEUR" in item),
        `${lang} prices must come from shared catalog`,
      );
    }
  }
  check(
    typeof brief.provenance?.enabled === "boolean",
    "provenance.enabled must be boolean",
  );
  check(
    Array.isArray(brief.assets) && brief.assets.length <= 6,
    "assets must be an array of at most six approved local images",
  );
  for (const asset of brief.assets ?? []) {
    check(
      typeof asset.file === "string" &&
        /^[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/.test(asset.file),
      "asset file must be a simple local raster filename",
    );
    for (const lang of LANGUAGES)
      check(nonempty(asset.alt?.[lang]), `asset needs ${lang} alt text`);
    check(
      asset.approved === true && nonempty(asset.rights),
      "only approved assets with rights evidence may be used",
    );
  }
  if (release) {
    for (const asset of brief.assets)
      check(
        typeof asset.sha256 === "string" && /^[a-f0-9]{64}$/.test(asset.sha256),
        "release assets need the SHA-256 of the reviewed bytes",
      );
    check(brief.status === "live", "release blocked: status is not live");
    check(
      safeHttps(brief.origin, { originOnly: true }),
      "release needs the real HTTPS origin",
    );
    for (const flag of ["facts", "assets", "legal", "publication"])
      check(
        brief.approvals?.[flag] === true,
        `owner approval missing: ${flag}`,
      );
    if (brief.provenance?.enabled)
      check(
        brief.approvals?.provenance === true,
        "owner must approve public tanwithme provenance or disable it",
      );
    for (const lang of LANGUAGES) {
      check(
        brief.approvals?.locales?.[lang] === true,
        `fluent local reviewer needed: ${lang}`,
      );
      check(
        nonempty(brief.legal?.[lang]?.notice) &&
          nonempty(brief.legal?.[lang]?.privacy),
        `approved ${lang} legal and privacy text required`,
      );
    }
    check(Boolean(b.phone), "release needs a confirmed call fallback");
    check(
      b.byAppointment || covered.size === 7,
      "confirm hours or appointment-only operation",
    );
    if (b.visitMode === "premises") {
      check(nonempty(b.address), "premises need an approved address");
      check(Boolean(b.mapUrl), "premises need verified directions");
    }
    check(
      nonempty(brief.review?.version) &&
        brief.review.version === brief.review?.approvedVersion,
      "review.version must match the exact approvedVersion",
    );
    check(
      brief.review?.approvedDigest === contentDigest(brief),
      "content changed or approvedDigest missing: owner must review the current version",
    );
    check(
      brief.review?.qaPassed === true &&
        brief.review?.ownerHandoffReady === true,
      "record actual QA and handoff readiness",
    );
    check(
      Array.isArray(brief.review?.evidence) &&
        brief.review.evidence.length > 0 &&
        brief.review.evidence.every(nonempty),
      "review needs evidence references, not empty pass flags",
    );
    const publicValues = JSON.stringify({
      business: b,
      copy: brief.copy,
      legal: brief.legal,
    });
    check(
      !/\[(?:OWNER|TO CONFIRM|PENDIENTE|REPLACE)|DEMO FICT|negoci real|negocio real|not a real|de mostra|de muestra|awaiting confirmation|pendientes? de confirmar|pendents? de confirmar/i.test(
        publicValues,
      ),
      "remove demo copy and unresolved placeholders before release",
    );
  }
  return errors;
}
export function whatsappLink(phone, message) {
  if (!/^\+[1-9]\d{7,14}$/.test(phone ?? ""))
    throw new Error("A verified international phone number is required");
  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(message)}`;
}
function hoursHtml(b, lang) {
  const l = labels[lang];
  if (b.byAppointment) return `<p>${l.appointment}</p>`;
  if (!b.hours.length) return `<p class="pending">${l.pending}</p>`;
  const fmt = new Intl.DateTimeFormat(lang, {
    weekday: "long",
    timeZone: "UTC",
  });
  return `<dl class="hours">${Array.from({ length: 7 }, (_, d) => {
    const row = b.hours.find((r) => r.days.includes(d));
    return `<div><dt>${escapeHtml(fmt.format(new Date(Date.UTC(2026, 0, 5 + d))))}</dt><dd>${row.intervals.length ? row.intervals.map((v) => v.join("–")).join(" · ") : l.closed}</dd></div>`;
  }).join("")}</dl>`;
}
function head(brief, lang, title, description, route = "index.html") {
  const root = brief.origin;
  const live = brief.status === "live";
  const h = escapeHtml;
  const alternate = root
    ? LANGUAGES.map(
        (code) =>
          `<link rel="alternate" hreflang="${code}" href="${h(root + "/" + code + "/" + (route === "index.html" ? "" : route))}">`,
      ).join("") +
      (route === "index.html"
        ? `<link rel="alternate" hreflang="x-default" href="${h(root + "/")}">`
        : "")
    : "";
  return `<!doctype html><html lang="${lang}" data-sector="${brief.business.sector}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><link rel="icon" href="data:,"><title>${h(title)}</title><meta name="description" content="${h(description)}"><meta name="robots" content="${live ? "index,follow" : "noindex,nofollow"}">${root ? `<link rel="canonical" href="${h(root + "/" + lang + "/" + (route === "index.html" ? "" : route))}">` : ""}${alternate}${brief.provenance.enabled ? '<meta name="generator" content="tanwithme"><link rel="alternate" type="application/json" href="../.well-known/tanwithme.json" title="Site provenance">' : ""}<link rel="stylesheet" href="../assets/site.css"></head>`;
}
function header(brief, lang, route = "index.html") {
  const h = escapeHtml;
  return `<a class="skip" href="#main">${labels[lang].skip}</a>${brief.status !== "live" ? `<div class="demo">${brief.status === "demo" ? labels[lang].demo : { ca: "ESBORRANY PRIVAT · Pendent de revisió", es: "BORRADOR PRIVADO · Pendiente de revisión", en: "PRIVATE DRAFT · Awaiting review" }[lang]}</div>` : ""}<header class="mast"><a class="brand" href="./index.html">${h(brief.business.name)}</a><nav aria-label="${labels[lang].nav}">${LANGUAGES.map((code) => `<a href="../${code}/${route}" lang="${code}" hreflang="${code}"${code === lang ? ' aria-current="page"' : ""}>${labels[code].lang}</a>`).join("")}</nav></header>`;
}
function footer(brief, lang) {
  const l = labels[lang];
  return `<footer><p>${escapeHtml(brief.business.name)} · ${escapeHtml(brief.business.neighbourhood)}, Barcelona</p><nav aria-label="${l.legal}"><a href="./legal.html">${l.legal}</a><a href="./privacy.html">${l.privacy}</a>${brief.business.instagramUrl ? `<a href="${escapeHtml(brief.business.instagramUrl)}">Instagram</a>` : ""}${brief.provenance.enabled ? `<a href="./provenance.html">${l.provenance}</a>` : ""}</nav></footer>`;
}
export function renderSite(brief) {
  const errors = validateBrief(brief, { release: brief.status === "live" });
  if (errors.length) throw new Error(errors.join("\n"));
  const files = new Map();
  const h = escapeHtml,
    b = brief.business;
  for (const lang of LANGUAGES) {
    const c = brief.copy[lang],
      l = labels[lang];
    const action = b.whatsapp
      ? `<a class="button" href="${h(whatsappLink(b.whatsapp, c.message))}">${h(c.cta)} ↗</a>`
      : b.phone
        ? `<a class="button" href="tel:${h(b.phone)}">${l.phone} ${h(b.phone)}</a>`
        : `<p class="pending">${l.inactive}</p>`;
    const fallback = b.phone
      ? `<a class="text-link" href="tel:${h(b.phone)}">${l.phone} ${h(b.phone)}</a>`
      : "";
    const services = `<section id="services" class="catalog"><p class="eyebrow">${b.sector === "trades" ? "02" : "01"} · ${l.services}</p><h2>${h(c.sectionTitle)}</h2><div>${c.items.map((it, i) => `<article class="service"><div><h3>${h(it.name)}</h3><p>${h(it.description)}</p></div><p class="price">${brief.catalog[i].priceEUR === null ? l.price : new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(brief.catalog[i].priceEUR)}</p></article>`).join("")}</div><p class="small">${h(b.priceNote[lang])}</p></section>`;
    const visit = `<section id="visit" class="visit"><div><p class="eyebrow">${b.sector === "trades" ? "01" : "02"} · ${b.visitMode === "service-area" ? { ca: "Zona de servei", es: "Zona de servicio", en: "Service area" }[lang] : l.location}</p><h2>${h(c.visitTitle)}</h2><p>${h(c.visitBody)}</p><p>${b.address ? h(b.address) : h(b.neighbourhood + ", Barcelona")}${b.visitMode === "premises" && !b.address ? `<br><span class="pending">${l.pending}</span>` : ""}</p>${b.mapUrl ? `<a class="text-link" href="${h(b.mapUrl)}">${l.directions} ↗</a>` : ""}</div><div><h3>${l.hours}</h3>${hoursHtml(b, lang)}</div></section>`;
    const gallery = brief.assets.length
      ? `<section class="gallery" aria-label="${l.image}">${brief.assets.map((a) => `<img src="../assets/${h(a.file)}" alt="${h(a.alt[lang])}" width="1200" height="900" loading="lazy">`).join("")}</section>`
      : "";
    const content = `<main id="main"><section class="hero"><div><p class="eyebrow">${h(c.eyebrow)}</p><h1>${h(c.headline)}</h1></div><div class="intro"><p>${h(c.intro)}</p><div class="actions">${action}</div><p class="small">${h(c.contactBody)}</p></div></section>${b.sector === "trades" ? visit + services + gallery : services + gallery + visit}<section id="contact" class="contact"><div><p class="eyebrow">03</p><h2>${h(c.contactTitle)}</h2><p>${h(c.contactBody)}</p></div><div class="actions">${action}${b.whatsapp ? fallback : ""}</div></section></main>`;
    files.set(
      `${lang}/index.html`,
      head(brief, lang, `${b.name} · ${b.neighbourhood}, Barcelona`, c.intro) +
        `<body>${header(brief, lang)}${content}${footer(brief, lang)}</body></html>`,
    );
    for (const [route, title, text] of [
      ["legal.html", l.legal, brief.legal?.[lang]?.notice],
      ["privacy.html", l.privacy, brief.legal?.[lang]?.privacy],
      ...(brief.provenance.enabled
        ? [["provenance.html", l.proof, l.explain]]
        : []),
    ]) {
      files.set(
        `${lang}/${route}`,
        head(brief, lang, `${title} · ${b.name}`, title, route) +
          `<body>${header(brief, lang, route)}<main id="main" class="legal"><h1>${title}</h1>${String(
            text || l.pending,
          )
            .split("\n")
            .filter(Boolean)
            .map((t) => `<p>${h(t)}</p>`)
            .join(
              "",
            )}${route === "provenance.html" ? '<p><a href="../.well-known/tanwithme.json">JSON · tanwithme</a></p>' : ""}</main>${footer(brief, lang)}</body></html>`,
      );
    }
  }
  const provenance = createProvenance(brief);
  if (provenance)
    files.set(
      ".well-known/tanwithme.json",
      JSON.stringify(provenance, null, 2) + "\n",
    );
  const homeMetadata =
    (brief.origin
      ? `<link rel="canonical" href="${h(brief.origin + "/")}">` +
        LANGUAGES.map(
          (l) =>
            `<link rel="alternate" hreflang="${l}" href="${h(brief.origin + "/" + l + "/")}">`,
        ).join("") +
        `<link rel="alternate" hreflang="x-default" href="${h(brief.origin + "/")}">`
      : "") +
    (brief.provenance.enabled
      ? '<meta name="generator" content="tanwithme"><link rel="alternate" type="application/json" href=".well-known/tanwithme.json" title="Site provenance">'
      : "");
  files.set(
    "index.html",
    `<!doctype html><html lang="ca" data-sector="${b.sector}"><head>${homeMetadata}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${brief.status !== "live" ? "noindex,nofollow" : "index,follow"}"><link rel="icon" href="data:,"><title>${h(b.name)} · Barcelona</title><link rel="stylesheet" href="assets/site.css"></head><body>${brief.status !== "live" ? '<div class="demo">' + (brief.status === "demo" ? "DEMOSTRACIÓ / DEMOSTRACIÓN / DEMO" : "ESBORRANY / BORRADOR / DRAFT") + "</div>" : ""}<main class="language-choice"><p class="eyebrow">${h(b.neighbourhood)}, Barcelona</p><h1>${h(b.name)}</h1><nav aria-label="Idioma / Language">${LANGUAGES.map((l) => `<a class="button" lang="${l}" href="${l}/index.html">${labels[l].lang} →</a>`).join("")}</nav><p>No és un negoci real. / No es un negocio real. / Not a real business.</p></main></body></html>`.replace(
      brief.status !== "demo"
        ? "<p>No és un negoci real. / No es un negocio real. / Not a real business.</p>"
        : "PLACEHOLDER_NOT_FOUND",
      "",
    ),
  );
  files.set(
    "robots.txt",
    brief.status !== "live"
      ? "User-agent: *\nDisallow: /\n"
      : `User-agent: *\nAllow: /\nSitemap: ${brief.origin}/sitemap.xml\n`,
  );
  if (brief.status === "live" && brief.origin)
    files.set(
      "sitemap.xml",
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", ...LANGUAGES.map((l) => l + "/")].map((r) => `<url><loc>${h(brief.origin + "/" + r)}</loc></url>`).join("")}</urlset>`,
    );
  files.set(
    "404.html",
    '<!doctype html><html lang="ca"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404</title><body><h1>404</h1><p>No trobem aquesta pàgina. / No encontramos esta página. / Page not found.</p><a href="/">Inici / Inicio / Home</a></body></html>',
  );
  return files;
}
export async function buildSite({ brief, root, outDir, release = false }) {
  const errors = validateBrief(brief, {
    release: release || brief.status === "live",
  });
  if (errors.length) throw new Error(errors.join("\n"));
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
    const files = renderSite(brief);
    files.set(
      "assets/site.css",
      await readFile(path.join(root, "src/site.css"), "utf8"),
    );
    files.set(".generated", "barcelona-local-sites-starter\n");
    const assetRoot = path.join(root, "site/assets");
    for (const a of brief.assets) {
      const resolved = await realpath(path.join(assetRoot, a.file));
      const realRoot = await realpath(assetRoot);
      if (!resolved.startsWith(realRoot + path.sep))
        throw new Error("Asset escapes asset directory");
      const size = (await stat(resolved)).size;
      if (size > 3 * 1024 * 1024)
        throw new Error("Image exceeds 3 MB; resize it first");
      const bytes = await readFile(resolved);
      if (
        a.sha256 &&
        createHash("sha256").update(bytes).digest("hex") !== a.sha256
      )
        throw new Error("Asset bytes changed after review: " + a.file);
      files.set("assets/" + a.file, bytes);
    }
    for (const [file, content] of files) {
      const dest = path.join(staging, file);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, content);
    }
    try {
      await rename(out, backup);
      moved = true;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    await rename(staging, out);
    if (moved) await rm(backup, { recursive: true });
    return { files: files.size, digest: contentDigest(brief), outDir: out };
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
}
