---
title: A shared system, a specific website
updated: 2026-09-07
status: working-design-system
tags: [barcelona, design, accessibility]
---

# A shared system, a specific website

A café visitor needs a different answer from someone looking for a plumber. Reuse the quality rules and data structure; choose the visual rhythm and section order around the customer's task. The first three working examples cover restaurants/cafés, barbers and local trades. They are starting points, not a promise that every sector fits unchanged.

## Choose the task before the look

| Business | Main customer task | Show early | Added complexity to defer |
| --- | --- | --- | --- |
| Restaurant / café | Check menu, hours and how to visit | Actual food offer, location, service hours | Ordering, live availability, social feeds |
| Barber / salon | Understand services and ask for a slot | Service inclusions, duration/price context, enquiry expectations | Custom booking engine, accounts |
| Trades / repairs | Check area and request a quote | Service area, work included, availability policy | Emergency guarantees, automatic quotations |
| Fitness / yoga | Check class suitability and schedule | Level, place, actual class times, enquiry | Memberships, health questionnaires |
| Tutor / language teacher | Understand fit and arrange a conversation | Subject, level, location/online delivery, price basis | Student accounts or recordings |
| Independent shop | Find a product category and visit | Stock caveat, location, hours, enquiry | Full inventory and e-commerce |
| Creative studio | See relevant work and discuss a project | Permitted portfolio, concrete scope, contact | Automated proposals or paid downloads |
| Regulated professional | Understand scope and reach the office | Verified qualifications and permitted claims | Sensitive intake or advice generation |

The last five are prompt-level adaptations. To implement them in this static generator, add an explicit sector adapter and tests; do not silently relabel an unsupported sector as a restaurant. Regulated services need their own requirements review.

## Build a visual argument

In `prompts/04-design.md`, explain one visitor need, one business-specific visual cue and why the layout serves both. Use owner-approved references for mood, not copied assets or proprietary page designs. Reject vague “premium, modern, stunning” directions without observable choices.

- **Restaurant:** warm paper, terracotta, an editorial serif headline, generous menu rows. Food photography comes from the owner when available; an empty image slot is unnecessary.
- **Barber:** cool off-white, ink/navy, strong sans-serif, squared edges and precise service rows. Make what a service includes easy to compare.
- **Trades:** soft green, practical sans-serif and service-area information before the service list. The copy must not imply a walk-in shop when none exists.

Use a different composition when the business needs it. Avoid decorating every section with cards, icons, gradients and animations. A useful photo, a clear menu and a good line break can carry the design.

## Semantic design tokens

| Role | Restaurant | Barber | Trades |
| --- | --- | --- | --- |
| Page | `#fffaf3` | `#f5f5f0` | `#f4f8f4` |
| Text | `#24241f` | `#152332` | `#163b2d` |
| Muted text | `#62564b` | `#4e5c69` | `#476454` |
| Action / accent | `#8b321b` | `#173d65` | `#1b513b` |
| Surface | `#f2e5d2` | `#e1e8eb` | `#dfebe1` |
| Border | `#95836f` | `#788895` | `#758d7c` |

All use white text on the accent and blue `#0046a8` focus indicators. Recheck contrast after changing any combination. Borders here divide content; interactive focus is explicit. The implementation is in `src/site.css`; the Figma handoff exports concrete values in `design-tokens.json`.

Use system UI fonts for body text; Georgia is the restaurant display fallback. No remote font request is needed. Body text starts at 17px, supporting copy at 15px, labels at 14px. Headlines scale between 2.8rem and 6.5rem. Main actions target 48px height; compact navigation links are at least 44px tall. Use a readable line length around 65 characters and room for longer Catalan, Spanish and English text.

## Component contract

| Component | Inputs | States / behavior |
| --- | --- | --- |
| Language navigation | ca/es/en routes | Native language names; preserve the current legal/info page; current language marked |
| Hero | offer, headline, short intro, one action | No unsupported superlatives; remains useful without a hero image |
| Service/menu row | shared item ID and numeric price + locale text | Same order and facts in each language; null price becomes a truthful request for price |
| Opening hours | all seven days, split intervals, closed days | Missing facts stay visibly pending in drafts; no automatic “open now” |
| Enquiry action | verified international number + generic locale message | WhatsApp link, phone fallback; inactive if no confirmed contact |
| Location/service area | visit mode, address/area, directions | Do not send visitors to a private residence or invented storefront |
| Gallery | at most six permitted local raster images + locale alt | Lazy loading; stable proportions; primary information remains readable if image fails |
| Legal footer | reviewed notice/privacy and optional provenance | Actual routes, full language equivalents, visible optional credit |

Restaurant menus can exceed this generator's 30-item starting limit. Agree a smaller overview with an accessible owner-maintained full menu link, or extend the content model deliberately. Do not reduce legally required information just to fit a template. The starter does not handle allergens, product variants, structured booking availability or checkout logic.

## Test the experience

Inspect 390, 768, 1024 and 1440px widths. Make the headline longer, remove the images, turn off JavaScript and walk through the page using a keyboard. A person should still find the offer, location/service area and next action. Confirm focus, contrast, text expansion, meaningful alt text and destinations on a real device. Automated checks help; they do not certify accessibility or native-language quality.

After a real client pilot, record one thing a visitor could not find. Change the relevant component or prompt, check the other two sectors, and keep a small regression example. That is how the shared system gets stronger through use.
