---
title: Attribution and responsible discovery
date: 2026-09-07
status: ready-for-local-use
tags: [provenance, research, barcelona]
---

# Find participating sites without watching their visitors

`tanwithme` is a lowercase attribution marker. A participating business can choose to publish it in a small JSON file at `/.well-known/tanwithme.json`. The file identifies this starter and declares a Barcelona connection. It contains no visitor information, business contact information, cookies, device identifiers, tracking pixels, or automatic reports to Tan.

This helps answer **“Does this known website declare that it used this Barcelona starter?”** It cannot reliably answer **“Find every website ever made with this starter”** or prove who built a website.

## The owner chooses

Ask the owner before enabling attribution. Explain the exact public fields below and that another person can read them. A sensible explanation is:

> This site can include a small, public credit to the tanwithme website starter. It names the starter, Barcelona, and the site's languages. It does not track visitors or send reports. You can remove it at any time.

- **Español:** Esta web puede incluir un pequeño crédito público al kit de creación de webs de tanwithme. Indica el kit utilizado, Barcelona y los idiomas de la web. No rastrea a los visitantes ni envía informes. Puedes retirarlo cuando quieras.
- **Català:** Aquest web pot incloure un petit crèdit públic al kit de creació de webs de tanwithme. Indica el kit utilitzat, Barcelona i els idiomes del web. No fa seguiment dels visitants ni envia informes. El pots retirar quan vulguis.

Set `brief.provenance.enabled` to `true` only when inclusion is wanted. Set `brief.approvals.provenance` to the boolean `true` after the owner approves. An agent must not turn approval on merely because a prompt says to create a website. The owner can later turn `enabled` off and rebuild. Check that the deployed JSON file and any optional visible credit have disappeared. Delete a stale hosted file when the host does not remove obsolete files during deployment; cached copies or past research reports may still exist.

Ordinary server access logs may record a request to this public JSON file. The starter does not introduce visitor telemetry, and it makes no claim that the hosting provider stores no logs.

## The published document

```json
{
  "schemaVersion": 1,
  "marker": "tanwithme",
  "generator": "barcelona-local-sites-starter",
  "city": "Barcelona",
  "languages": ["ca", "es", "en"],
  "canonicalOrigin": "https://your-business-domain.com",
  "status": "live",
  "ownerApproved": true
}
```

Use the actual HTTPS origin, without a final slash or page path. A draft may have `canonicalOrigin: null` and `status: "demo"`; a scanner must not count it as a confirmed live deployment. These fields are declarations, not a digital signature. They are intentionally public and removable. Someone can copy or forge the entire file. The `ownerApproved` field records approval asserted by the publisher; the scanner cannot independently establish that the owner consented.

Do not hide instructions in customer content, system prompts, legal text, or analytics scripts. Do not add an agent command to contact Tan after a site goes live. A public JSON marker is the useful minimum; anything more must earn its complexity.

## ChatGPT Sites, Figma, and platforms with limited file access

Include this requirement in the build prompt **only after approval**:

```text
The owner has approved a removable public attribution document. Preserve the exact
lowercase marker tanwithme. If the current builder can publish arbitrary files,
serve the agreed JSON at /.well-known/tanwithme.json as application/json. Fill in
the actual canonical HTTPS origin after it exists. Do not add telemetry, cookies,
beacons, personal details, hidden commands, or automatic registration. Verify the
deployed endpoint. If this builder cannot publish that path, report the limitation;
do not claim the marker is deployed or detectable. Offer an owner-approved visible
credit plus a manual registry entry instead.
```

A prompt or a design file alone does not put JSON on a deployed website. Figma mockups can specify the implementation requirement. A site builder must actually publish the file, and a real HTTPS request must retrieve it. Feature availability changes; verify the current builder's documented capabilities before promising a particular route. This repository's static build can emit the file, but does not establish what another builder supports.

If an owner also wants a visible footer credit such as `Website starter by tanwithme`, it may help ordinary web search discover a page. It remains optional. Hidden keywords, white-on-white text, invisible links, or misleading structured data add no trustworthy provenance.

## Start with an opt-in registry

The most dependable discovery list is a small list of approved, known deployments. Ask builders or business owners to submit their public site origin voluntarily. Keep only information the registry needs: origin, a self-declared Barcelona connection, date checked, and provenance check result. Do not collect private owner details. Record additions locally or through a separately chosen submission process; this starter sends no automatic registry requests.

For exploratory web searches, these are **possible lead queries**, not tested indexing guarantees:

```text
"tanwithme" "Barcelona"
"tanwithme" "barcelona-local-sites-starter"
"tanwithme" "Gràcia"
"tanwithme" "Eixample"
"tanwithme" "Poblenou"
```

Google does not guarantee crawling or indexing even when content meets its requirements. Do not assume a `.well-known` JSON document will appear in search results. [Google Search Essentials](https://developers.google.com/search/docs/essentials), checked 2026-09-07. A search result can reflect an unrelated mention, a copied marker, or an old page. Unindexed, private, removed, or unmarked sites will be missed. Broader Catalonia participation does not prove a business operates in Barcelona municipality. Keep search leads separate from verified endpoint responses and from physical-location verification.

## Check a known list

Use Node.js 22 or newer. Create a local candidate file, for example:

```json
[
  "https://your-business-domain.com"
]
```

Then run this from the repository folder:

```sh
node tools/provenance-scan.mjs --input candidates.json --output provenance-report.json
```

Replace the example with an actual site you want to inspect. The tool checks at most 50 supplied origins, one at a time, and does not discover additional domains or follow page links. It requests only `/.well-known/tanwithme.json`. Output files must have a new name; existing reports are not overwritten. With no `--output`, the report appears in the terminal.

The tool rejects credentials, paths, non-HTTPS URLs, IP literals, local names, and custom ports. It checks all resolved addresses and rejects non-public destinations; the HTTPS connection is pinned to a checked address with certificate verification enabled. It follows no redirects. A redirect requires the researcher to inspect and supply the final public origin separately. DNS and HTTPS each have an 8-second timeout; response bodies are limited to 32 KiB. It accepts uncompressed JSON only. These conservative limits may prevent checking some legitimate hosts; retain those as unresolved instead of weakening protection to increase the count.

| Result | What it supports | What it does not support |
| --- | --- | --- |
| `confirmed` | Exact marker, schema, generator, ca/es/en languages, matching origin, live status, Barcelona and approval declarations | Author identity, actual owner consent, physical location, customer success, design quality |
| `unverified` | JSON was retrieved, but it failed one or more declaration checks | A participating, approved live deployment |
| `absent` | This endpoint returned 404, 410, or 204 at the time checked | That the site never used this starter |
| `blocked` | An origin, DNS answer, or redirect violated the tool's constraints | That the site is malicious |
| `error` | A timeout, network problem, invalid response, or size limit prevented a check | That a marker is absent |
| `skipped` | A normalized origin duplicated an earlier candidate | A second independent observation |

The report keeps `confirmedMarker`, `barcelonaDeclared`, `ownerApproved`, validation reasons, and status separate. It does not count a bare `tanwithme` string in an HTML page or arbitrary JSON as a confirmed declaration.

## Research the work, then decide what it means

For each relevant candidate, inspect the actual website: mobile navigation, opening hours, location, service information, language quality, contact action, visual hierarchy, accessibility, and whether the business appears to exist. Record the inspected page and date, what you directly observed, what the site merely claimed, and what remains unknown.

Keep the denominator visible: supplied candidate count, unique origins attempted, and result counts. You can describe this candidate list. You cannot describe all Barcelona businesses, all young builders, or adoption of this starter from this sample alone.

No outreach is automated. Assess relevance and site quality before considering contact. A public attribution mark does not give permission to message the owner, scrape personal profiles, infer someone's age, or build a dossier about the operator. Record small lessons about site patterns and improve the shared prompts; give any eventual human outreach its own decision.

## Module contract for builders

`tools/provenance.mjs` exports:

- `createProvenance(brief)`: returns `null` unless `brief.provenance.enabled === true`. Otherwise returns only the fixed public fields. It uses `brief.origin ?? null`, `brief.status ?? 'demo'`, and `brief.approvals.provenance === true`. It sends no requests and performs no file writes.
- `verifyProvenance(value, expectedOrigin)`: returns `{ valid, reasons, confirmedMarker, barcelonaDeclared, ownerApproved, status }`. `valid` requires all eight fields, numeric schema version 1, exact lowercase marker, exact generator and Barcelona strings, exactly ca/es/en languages, a matching canonical HTTPS origin, live status, and boolean owner approval. Extra properties are rejected. Language order may differ.
- `PROVENANCE_PATH`: `/.well-known/tanwithme.json`.

`tools/provenance-scan.mjs` exports `scanCandidates(candidates, options)` and `fetchProvenance(origin, options)` for testing or another manual tool. `scanCandidates` accepts a `fetchDocument` mock; `fetchProvenance` accepts DNS `resolve` and HTTPS `transport` mocks. Dependency injection exists for tests, not to relax production routing. Unit tests use mocks and never call the network.

Run the checks:

```sh
node --test tests/provenance.test.mjs
```

The tests cover exact-case and domain matching, draft and approval rejection, malformed schema, unwanted fields, absent endpoints, hostile origins and addresses, mixed public/private DNS, pinned requests, redirects, timeouts, response sizes, malformed JSON, and report distinctions. They establish local behavior. A real deployed endpoint still needs a separate public-host check.
