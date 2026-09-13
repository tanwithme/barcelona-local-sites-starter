// Public discovery metadata. Call only after validating the business brief.
const locales = { ca: "ca_ES", es: "es_ES", en: "en_GB" };
export const jsonForHtml = (value) =>
  JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
  );

export function businessGraph(brief, lang) {
  if (brief.status !== "live" || !brief.origin) return null;
  const b = brief.business,
    c = brief.copy[lang];
  const identity = brief.origin + "/#business";
  const area = { "@type": "Place", name: `${b.neighbourhood}, ${b.city}` };
  const business = {
    "@type": b.visitMode === "premises" ? "LocalBusiness" : "Organization",
    "@id": identity,
    name: b.name,
    url: brief.origin + "/" + lang + "/",
    description: c.intro,
    telephone: b.phone,
    areaServed: area,
  };
  // A private operating address is not a public storefront.
  if (b.visitMode === "premises" && b.address)
    business.address = {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: b.city,
      addressCountry: "ES",
    };
  if (b.instagramUrl) business.sameAs = [b.instagramUrl];
  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      ...(b.sector === "restaurant"
        ? []
        : c.items.map((item, index) => ({
            "@type": "Service",
            "@id": brief.origin + "/#service-" + encodeURIComponent(item.id),
            name: item.name,
            description: item.description,
            provider: { "@id": identity },
            areaServed: area,
            ...(brief.catalog[index].priceEUR === null
              ? {}
              : {
                  offers: {
                    "@type": "Offer",
                    price: brief.catalog[index].priceEUR,
                    priceCurrency: "EUR",
                  },
                }),
          }))),
    ],
  };
}

export function discoveryHead(brief, lang, title, description, route, escape) {
  if (brief.status !== "live" || !brief.origin) return "";
  const url = `${brief.origin}/${lang}/${route === "index.html" ? "" : route}`;
  const values = {
    "og:type": "website",
    "og:site_name": brief.business.name,
    "og:title": title,
    "og:description": description,
    "og:url": url,
    "og:locale": locales[lang],
  };
  let html = Object.entries(values)
    .map(
      ([key, value]) => `<meta property="${key}" content="${escape(value)}">`,
    )
    .join("");
  if (route === "index.html" && brief.assets.length) {
    const asset = brief.assets[0];
    html += `<meta property="og:image" content="${escape(brief.origin + "/assets/" + asset.file)}"><meta property="og:image:alt" content="${escape(asset.alt[lang])}">`;
  }
  if (route === "index.html")
    html += `<script type="application/ld+json">${jsonForHtml(businessGraph(brief, lang))}</script>`;
  return html;
}

// Evaluate common robots rules for the starter's simple public paths. Training
// crawler policy is separate: a GPTBot block must not fail a search-access check.
function robotsAllows(text, agent, pathname) {
  const groups = [];
  let group = { agents: [], rules: [] };
  for (const line of text.split(/\r?\n/)) {
    const match = line
      .replace(/#.*/, "")
      .trim()
      .match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase(),
      value = match[2].trim();
    if (key === "user-agent") {
      if (group.rules.length) {
        groups.push(group);
        group = { agents: [], rules: [] };
      }
      group.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && group.agents.length) {
      group.rules.push({ allow: key === "allow", pattern: value });
    }
  }
  groups.push(group);
  const applicable = groups.map((g) => ({
    ...g,
    specificity: Math.max(
      -1,
      ...g.agents.map((a) =>
        a === "*" ? 0 : a && agent.toLowerCase().includes(a) ? a.length : -1,
      ),
    ),
  }));
  const specificity = Math.max(-1, ...applicable.map((g) => g.specificity));
  if (specificity < 0) return true;
  const rules = applicable
    .filter((g) => g.specificity === specificity)
    .flatMap((g) => g.rules)
    .filter((r) => r.pattern);
  let best = -1,
    allowed = true;
  for (const rule of rules) {
    const end = rule.pattern.endsWith("$");
    const raw = end ? rule.pattern.slice(0, -1) : rule.pattern;
    const expression = raw
      .split("*")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");
    if (new RegExp("^" + expression + (end ? "$" : "")).test(pathname)) {
      const length = raw.replaceAll("*", "").length;
      if (length > best || (length === best && rule.allow)) {
        best = length;
        allowed = rule.allow;
      }
    }
  }
  return allowed;
}

// Inspects generated output. It does not contact engines or infer indexing.
export function auditDiscovery(brief, files) {
  const checks = [],
    live = brief.status === "live";
  const add = (name, pass) =>
    checks.push({ check: name, result: pass ? "pass" : "fail" });
  for (const lang of ["ca", "es", "en"]) {
    const html = files.get(`${lang}/index.html`) ?? "";
    const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
    add(
      `${lang}: initial HTML and language`,
      html.includes(`<html lang="${lang}"`) &&
        html.includes('<main id="main">'),
    );
    add(
      `${lang}: title and description`,
      /<title>[^<]+<\/title>/.test(html) &&
        /<meta name="description" content="[^"]+">/.test(html),
    );
    const escaped = (value) =>
      String(value).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    add(
      `${lang}: current visible business facts`,
      [
        brief.business.name,
        brief.copy[lang].headline,
        brief.copy[lang].intro,
        ...brief.copy[lang].items.map((i) => i.name),
      ].every((value) => body.includes(escaped(value))),
    );
    add(
      `${lang}: contact and services`,
      html.includes('id="contact"') && html.includes('id="services"'),
    );
    add(
      `${lang}: index policy`,
      html.includes(
        `name="robots" content="${live ? "index,follow" : "noindex,nofollow"}"`,
      ),
    );
    if (live) {
      const url = brief.origin + "/" + lang + "/";
      add(`${lang}: canonical`, html.includes(`rel="canonical" href="${url}"`));
      add(
        `${lang}: language alternates`,
        ["ca", "es", "en"].every((l) =>
          html.includes(`hreflang="${l}" href="${brief.origin}/${l}/"`),
        ),
      );
      add(
        `${lang}: social URL`,
        html.includes(`property="og:url" content="${url}"`),
      );
      let graph;
      try {
        graph = JSON.parse(
          html.match(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
          )?.[1],
        );
      } catch {
        /* reported below */
      }
      add(
        `${lang}: structured public facts match brief`,
        JSON.stringify(graph) === JSON.stringify(businessGraph(brief, lang)),
      );
    } else {
      add(
        `${lang}: no live business declaration`,
        !html.includes("application/ld+json"),
      );
    }
  }
  const robots = files.get("robots.txt") ?? "";
  add(
    "crawler policy",
    robots.trim().length > 0 &&
      (live
        ? ["Googlebot", "bingbot", "OAI-SearchBot"].every((agent) =>
            ["/", "/ca/", "/es/", "/en/"].every((route) =>
              robotsAllows(robots, agent, route),
            ),
          ) && robots.includes(`Sitemap: ${brief.origin}/sitemap.xml`)
        : ["Googlebot", "bingbot", "OAI-SearchBot"].every((agent) =>
            ["/", "/ca/", "/es/", "/en/"].every(
              (route) => !robotsAllows(robots, agent, route),
            ),
          )),
  );
  if (live) {
    const sitemap = files.get("sitemap.xml") ?? "";
    add(
      "sitemap language URLs",
      ["ca", "es", "en"].every((l) =>
        sitemap.includes(`<loc>${brief.origin}/${l}/</loc>`),
      ),
    );
  } else add("draft has no live sitemap", !files.has("sitemap.xml"));
  const passed = checks.every((c) => c.result === "pass");
  return {
    state: !passed
      ? "needs-fix"
      : live
        ? "local-technical-checks-pass"
        : "draft-intentionally-noindex",
    passed,
    checks,
    limits:
      "Local generated files only. Live HTTP, CDN/WAF, provider verification, indexing, AI citations and customer outcomes are not checked.",
  };
}
