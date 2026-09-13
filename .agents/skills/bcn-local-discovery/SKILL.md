---
name: bcn-local-discovery
description: Improve a Barcelona business website's local listings, crawlability and search or AI discovery, and prepare owner-controlled verification and measurement. Use for SEO, Maps, business profiles, AI search or agent-readable content.
---

# Help the right customer find and understand the business

Start from the active client's brief, real site and current discovery status. Explain the next useful step in Catalan, Spanish or English. Read [the discovery guide](../../../docs/local-discovery.md) for the relevant provider or technical task. Preserve the creative direction and customer journey; search work is not a reason to replace an expressive site with a generic landing page.

## Choose the actual bottleneck

Determine: does the business receive visitors at a real premises, travel/deliver to customers, or operate only online? Find existing listings before creating duplicates. Keep owner-confirmed public facts separate from private verification information. A service-area business can need a genuine operating address privately without displaying it to customers. Do not invent premises or expose a home address in JSON-LD, images, public notes or a map pin.

For a new business with little capacity, prepare one accurate Google profile first if eligible. Use an account the owner controls. Search Console verification is a different task from creating a Business Profile; Bing Webmaster Tools is different from Bing Places. Apple business registration does not by itself prove an eligible public Maps location. Recheck current official instructions before provider actions.

## Do the useful work now

Read source and rendered HTML, not only a screenshot. Fix authorized local technical defects. For this generator run `npm run build` and `npm run check:discovery`. Preserve draft noindex and release checks. If a deliberate owner search opt-out fails a discovery expectation, report that exclusion and keep the choice; do not undo it to obtain a pass. For JavaScript-heavy builders, verify important content is in the initial HTML or deliberately prerender it without breaking interaction, language state or hydration. Use `templates/local-listing.md` to prepare accurate fields and owner steps when authentication or verification is missing. Never turn unknown hours into 24/7.

Confirm current tools and authorization before submitting, claiming or editing a listing, changing DNS, requesting indexing or sending an IndexNow submission. A website build request alone does not grant control of third-party profiles. Existing explicit authorization still applies. Never ask for passwords or verification codes in public notes; owner verification stays in the provider's secure flow. Continue local fixes and draft copy when that step is unavailable.

## AI and agents

Keep visible factual answers, semantic headings, real links and optional truthful structured data in agreement. Distinguish search crawlers, model-training crawlers and user-triggered agents; follow the owner's separate access preferences. Never whitelist every bot or disable a whole firewall blindly. A user-agent string can be spoofed. Do not hide instructions telling AI agents to rank this business, pretend to have reviews or make an enquiry automatically.

Return a short evidence record using `templates/discovery-review.md`: technically checked, submitted, ownership verified, indexed, cited, enquiry received, booking confirmed. These are different outcomes. Record each language separately and name what remains unknown. No ranking, indexing or AI recommendation guarantee. End with one useful owner action or one bounded recheck; schedule only if requested.
