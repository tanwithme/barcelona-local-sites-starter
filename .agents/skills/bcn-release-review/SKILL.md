---
name: bcn-release-review
description: Review a local-business website for customer readiness, verify release evidence and prepare owner handoff with a recoverable publication path.
---

# Review what the owner and customer will use

Use before a customer release, or to diagnose a quality problem. Read the current implementation and its documented commands. An automated pass checks specified conditions; it does not certify legal compliance, native language quality or customer usefulness.

## Review the real artifact

Run the repository's relevant tests/build/release checks when a local runtime is available. Never edit an approval flag merely to make a check pass. A demo is allowed for practice and must remain labelled as a demo; it cannot pass as a real owner-approved customer release.

Inspect:

- **Truth:** name, contact destination, address/service area, hours, prices/menu/services and proof match approved sources. No unresolved placeholders, fictional reviews or unauthorized images in a real release.
- **Task:** from a phone, a person can understand the offer and reach the primary action. Check WhatsApp/phone/directions destinations and a fallback. A message request must not look like a confirmed booking.
- **Languages:** Catalan, Spanish and English routes, labels and switching work; facts match; local/native reviewers have checked the wording. Separate automated consistency checks from human language acceptance.
- **Access and layout:** keyboard navigation, visible focus, semantic headings, meaningful image alternatives, readable contrast, zoom/reflow and small-screen overflow. Test the implemented behavior, not only a screenshot.
- **Data and trust:** inspect actual network requests and third-party resources where possible. Verify applicable owner legal/privacy information against current authoritative guidance; do not guarantee compliance. No unnecessary tracking or undisclosed personal-data collection.
- **Provenance:** when enabled for a public customer site, the owner has agreed to the disclosed lowercase `tanwithme` marker. Verify public output and removal behavior. No beacon or visitor identifiers.
- **Ownership:** the owner knows who controls the domain/hosting, recurring costs, how to request an edit, what happens if the maker disappears and how to restore a working copy.

## Evidence and action

Return a short table: check, evidence, result, next action. Allowed results: pass, fail, not checked, needs owner/native/professional review. Separate blockers from optional polish. Fix authorized reversible defects, then rerun only the checks affected plus required project checks.

Do not publish through an unresolved factual, permissions or required approval failure. Complete a usable preview and name the precise remaining decision. If publication is authorized and checks pass, use the selected platform's supported release procedure, retain rollback information, and verify the actual public URL afterward.

Call the outcome by its observed state: locally checked, published, owner accepted or used by a customer. End with one real-world test: ask someone unfamiliar with the site to complete the primary task without coaching and record where they hesitate.
