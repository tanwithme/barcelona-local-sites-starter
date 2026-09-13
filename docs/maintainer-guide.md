---
title: Maintainer guide
updated: 2026-09-07
status: implementation-guide
tags: [barcelona, implementation, maintenance]
---

# Maintain one small working website

Beginners can ask the assistant to do these steps. They do not need to learn JSON or hashes before writing a useful headline.

## Local commands

Node.js 22 or later; zero npm dependencies. Run commands from the repository root.

| Command | Result |
| --- | --- |
| `npm run setup -- --target "new absolute folder" --language es` | Sets up a complete isolated desktop studio from the packaged source |
| `npm run doctor` | Checks the installed studio/client files and generated outputs |
| `npm run client -- --name project-label --sector barber --language es` | Creates a fresh fictional client seed in the installed studio |
| `npm run package:refresh` | Maintainer only: rebuilds the source file manifest after changes and generated-output updates |
| `npm run build:library` | Rebuilds the offline welcome from `START-HERE.md`, task prompts and `src/welcome.html` |
| `npm test` | Local regression checks with synthetic fixtures and mocked scanner network |
| `npm run build` | Rebuilds `dist/`; live briefs still undergo release checks |
| `npm run preview` | Serves existing `dist/` on the printed localhost address; Ctrl+C stops it |
| `npm run build:demo` | Rebuilds the tracked fictional `demo/`; refuses a non-demo brief |
| `npm run handoff` | Writes Sites/Figma draft prompts, public content, tokens and approved image files into ignored `exports/` |
| `npm run check:release` | Checks recorded live prerequisites without writing; expected to fail on the starter demo |
| `npm run build:release` | Checks release prerequisites and actual image bytes, then builds; does not deploy |
| `npm run scan -- --input candidates.json --output research-results/results.json` | Checks a bounded supplied list of public candidate origins; see the research guide |

Before saving scanner reports into `research-results/`, create that local folder (`mkdir -p research-results`). The scanner preserves earlier reports by refusing to overwrite them.

Try another fictional example with `node tools/build.mjs --brief examples/barber.json`. This changes `dist/`, not the source brief. Run `npm run build` to restore the default preview. `examples/trades.json` and `examples/restaurant.json` work the same way.

Setup uses `starter-manifest.json` to copy only the checked starter snapshot. It never copies Git credentials, live project notes or client folders. Re-running setup preserves an existing studio; updates require an explicit comparison/backup workflow. See [INSTALL.md](../INSTALL.md).

## Content is shared; language expression varies

`site/brief.json` is the input. The current sectors are `restaurant`, `barber`, `trades`; the city is Barcelona. `copy.ca`, `copy.es`, `copy.en` share catalog IDs and order. Only `catalog[].priceEUR` holds numeric prices. Use `null` for unknown values; never insert example contacts into a real release.

`status: demo` is explicitly fictional. `draft` is a real private working draft. `live` invokes release checks through both render and build. “Private” is a workflow description, not authentication: `noindex` and robots rules do not prevent public access. Keep drafts local or behind an actual access restriction. A published preview URL needs its own access decision.

Hours use `days: [0,1,2,3,4,5,6]` for Monday through Sunday. Each day appears once if hours are supplied. Use `intervals: []` for closed days, and separate intervals for a midday break. An interval may end at `24:00`; split overnight service over the two real days. `byAppointment: true` replaces displayed hours with appointment-only wording.

`visitMode: service-area` describes a mobile service, not a walk-in premises. Keep its title and body consistent. An appointment-only flag is a business fact, not an easy way to skip unknown opening hours.

## Images and public copy

Put approved images in `site/assets/` with simple filenames (PNG, JPEG, WebP or AVIF, at most six, each at most 3MB). Add locale alt text, `approved: true` and a private rights-evidence reference in the brief. Ask the assistant to calculate each file's `sha256` before release. The source brief and photographs may contain sensitive material: keep a real client's repository private, even though this fictional starter is shareable.

The renderer escapes ordinary text; it does not support arbitrary HTML in copy/legal fields. Use plain URLs for map/social destinations. Legal text is owner/adviser supplied, not a fabricated “compliant” boilerplate. Review the actual provider, cookies/logs and business obligations.

## Release records mean something only when the work happened

Use [release-record.md](../templates/release-record.md). First prepare the source content, approved asset hashes, actual domain, `live` status and owner approval flags. Then capture the digest printed by the builder or ask the assistant to call `contentDigest`. Have the owner review the exact preview/version and record that digest as `review.approvedDigest`; set the version, evidence references and QA/handoff fields only after the checks occurred.

The digest covers the brief's content and expected image hashes; actual builds compare image bytes. It excludes `review` so adding evidence does not invalidate the content. It is a change detector, **not a signature, identity check or proof that someone truly approved**. Code/CSS changes also need a fresh rendered review and new version: the brief digest alone does not cover source code or provider behavior.

Handoffs validate a live source before exporting, include a public-field allowlist and copy the reviewed legal text/images. Private rights notes and review evidence stay out. Every export creates a new **draft**: a different renderer can change the result, so source approval cannot certify the new website. `exports/design-tokens.json` and `src/site.css` must remain consistent when a palette changes.

## Recovery and ownership

Builds stage their output, replace only a directory marked `.generated` and retain the previous output if validation or image loading fails. Do not run parallel builds into the same directory. `dist/` and `exports/` are generated: edit the source, not those outputs. Keep source in Git and retain the last working deployed version. For a bad change, restore the previous source commit and rebuild; follow the host's version rollback for an already published site.

Use client-owned domain/hosting accounts and explain renewal costs and who can change hours, photos and prices. Transfer the source, permitted assets and tested backup before considering handoff complete. Preserve existing email/DNS when connecting a domain. No deployment or purchase happens from this repository's commands.

Private data belongs in ignored `private/` or `clients/`, never in screenshots or issues on a public repository. `.gitignore` is a convenience, not proof of secrecy; inspect staged files before pushing. Actual Sites IDs/configuration belong in ignored `.openai/hosting.json`, using current installed provider tools. The checked-in example is not a deployment configuration for a registered Site.


## Maintain the design method

`docs/designer-playbook.md` is the canonical standalone design method. The design skill reads it; `writeHandoff` embeds it into all three builder prompts. Do not maintain separate shortened copies that lose the protected idea or review loop. Missing method content must stop export rather than silently producing a generic prompt. Regenerate handoffs after a method change.

Run the [design review](../templates/design-review.md) on source/CSS changes. Keep functional checks distinct from aesthetic judgment. Existing studio installs are preserved on rerun: compare and back up before explicitly updating one. This repository update does not silently upgrade previously installed studios or client sites.


## Discovery metadata and checks

Run `npm run check:discovery` after the current brief's build. It inspects local generated language pages, metadata, structured facts, robots and sitemap. A draft passes only as intentionally noindex; a real `live` brief must first satisfy existing release checks. A pass does not verify public HTTP/CDN behavior, a business listing, indexing or an AI citation.

`src/discovery.mjs` emits social metadata and safely serialized JSON-LD only for live, validated briefs. The same stable business identity is used in all languages. Public premises use LocalBusiness with the supplied address; service-area businesses use Organization without an address. Barber/trades catalogue Service nodes use visible localized text and shared prices, omitting unknown prices. Hours, precise geo-coordinates and extra profile URLs are deliberately not inferred. Existing generic live robots rules allow compliant crawlers broadly; honor a separate owner training-access choice explicitly.

Handoffs embed both the canonical design method and `docs/local-discovery.md`. The copilot should add the public-safe client-specific creative direction before sending to a different builder. Neither exported prompts nor this checker configure a provider account. See [local discovery](local-discovery.md).

The crawler check evaluates common robots rules for Googlebot, bingbot and OAI-SearchBot on the root and three language home paths. A separate GPTBot training block is allowed. An intentional search opt-out can fail this discoverability expectation: preserve the owner's choice and report the exclusion rather than undoing it to get a pass. This is not a complete robots conformance test or evidence of an actual provider crawl.

## Studio voice and copy

`docs/studio-voice.md` is the shared voice method. The coaching/design skills read it, and `writeHandoff` embeds it in all three builder prompts. Keep the client's own approved voice and material promises separate from the studio's teaching voice. Do not import private transcripts into this package. Changes to fictional example copy must preserve its demo status and inactive contact details; rebuild the committed demo and offline welcome afterwards.
