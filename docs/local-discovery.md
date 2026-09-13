---
title: Local discovery through listings, search and AI
updated: 2026-09-13
status: source-checked-guide
tags: [barcelona, search, listings, ai]
---

# Make the business findable without flattening its character

The tanwithme studio approach connects three things: a real business, a distinctive experience and facts that customers and machines can read. Search improvements should preserve the site's voice and working interactions. This guide is for the copilot; it explains only the next relevant step to the learner in their chosen language. Provider guidance below was checked on 13 September 2026. Recheck it before acting on a later account or changed interface.

## Start where the business actually operates

| Model | Useful first move | Information to protect |
| --- | --- | --- |
| Customers visit a staffed premises | Find/claim the existing eligible Google profile; check name, location, hours and main category | Publish only the actual approved customer address |
| The business visits or delivers to customers | Check eligibility for a service-area profile and prepare real coverage | Keep the private operating/verification address out of public website data and Maps display |
| Online only | Work on website search and genuine public profiles; check each provider's eligibility | Do not manufacture a storefront or Maps pin |

Google permits qualifying businesses that receive customers or travel to them. Use the real business name, appropriate minimal categories and existing profile where possible. Do not add SEO phrases to the name or use virtual premises to obtain a listing. [Google representation guidelines](https://support.google.com/business/answer/3038177).

For a service-area business, Google says to remove the address from public profile display when customers are not served there. A business visiting/delivering to customers can use service areas; online-only work is not the same model. Specify actual areas rather than a fictional city-wide footprint. Verification can still require private operating information. [Google service-area guidance](https://support.google.com/business/answer/9157481).

## A manageable listing sequence

1. **Google Business Profile:** owner-controlled account, real name, category verified in the current local interface, approved public phone, canonical site URL, services, correct hours/appointment arrangement and a few permitted real photos. Keep holiday changes current. Invite honest reviews from real customers without incentives or selective positive-review filtering. Google describes local ranking in terms of relevance, distance and prominence; buying or promising a particular position is not the service. [Local ranking](https://support.google.com/business/answer/7091), [review policy](https://support.google.com/contributionpolicy/answer/7400114).
2. **Bing Places:** check for an existing entry and claim/update through the current portal. Bing's guidance requires a valid address and allows some business types to hide it; verify the category's current behavior before publishing. Do not treat Bing Webmaster verification as a Places listing. [Bing Places](https://www.bingplaces.com/Home/Index), [current portal announcement](https://blogs.bing.com/search/October-2025/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners%2C-Powered-by-Research).
3. **Apple:** review Apple Business / Business Connect for the owner's actual business type and Spanish availability. Online and service businesses can register for brand presence; a public physical Maps location is a separate representation to verify in the current workflow. Do not fabricate a customer address to obtain one. [Apple Business support](https://business.apple.com/support), [Apple location setup](https://support.apple.com/en-ph/guide/business/abcb98816a34/web).
4. **Relevant local sources:** an existing neighbourhood association, genuine professional directory or owner-used booking platform can help customers when its listing is accurate. Choose relevance and upkeep capacity; avoid bulk directory blasts, paid-link packages and duplicate profiles.

Use [the listing worksheet](../templates/local-listing.md). Keep verification details in the provider's secure flow, with recovery and primary ownership controlled by the business. Do not create accounts in the maker's identity as a shortcut. With a slow-moving owner, prepare copy and an exact next action; no constant posting programme is required by this starter.

## The website foundation

Our implementation choices: useful initial HTML in ca/es/en; stable real links; visible business identity, offer, area, price basis and contact expectations; titles/descriptions that describe the page; self-canonical language URLs; reciprocal language alternates; real 200 pages and genuine 404 responses; sitemap for live canonical pages; appropriate robots/meta/HTTP controls. Do not hide practical facts inside graphics, hover-only panels or an interaction that bots and people must complete first. Search engines do not all execute JavaScript the same way.

The portable generator already produces static HTML. For React/Make/Sites output, inspect raw responses as well as the browser and preserve any working selection or enquiry state when adding prerendering. Do not show bots a different offer from customers. Verify a missing route's actual HTTP status: having a 404 file does not configure every host correctly. [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [multilingual pages](https://developers.google.com/search/docs/specialty/international/localized-versions).

Use one shared fact sheet across the website and listings. Three languages mean three useful expressions of the same business, not three contradictory facts or three business profiles. Avoid repetitive neighbourhood doorway pages. Add an area-specific page only when it has distinct, useful and verified service information.

## Structured data describes reality

Add JSON-LD that agrees with visible content, using a stable business identity across languages. Google's LocalBusiness feature requires a physical address. Do not publish a private address or invent one just to meet that feature's requirements. The starter uses `LocalBusiness` for approved public premises and `Organization` for service-area businesses. Barber and trades catalogue items become `Service` nodes; restaurant menu categories are not automatically classified as services. This is a conservative semantic description, not a claim of rich-result eligibility. Confirm more specific types before extending it. Do not add fictional ratings, aggregate reviews, availability, awards, geo-coordinates or booking actions. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Schema.org Organization](https://schema.org/Organization), [Schema.org Service](https://schema.org/Service).

The built-in live graph includes only public brief fields; it omits service-area addresses, private rights evidence and review notes. It uses the existing neighbourhood/city as the stated area, not an inferred radius. Hours and profile URLs beyond the supplied Instagram URL are currently omitted; extend the model deliberately if needed. A service-area brief must still keep any private address out of fields rendered visibly elsewhere. Test the complete output, not only JSON-LD.

## AI search and visiting agents

Google says normal SEO foundations apply to AI Overviews and AI Mode: a page must be indexed and eligible for a snippet; useful textual content, internal links and matching structured data matter. It does not require a special AI schema or AI text file. Eligibility does not guarantee inclusion. Treat `llms.txt` as an optional experiment, never a required unlock or replacement for HTML, robots rules and indexing. [Google AI features](https://developers.google.com/search/docs/appearance/ai-features).

OpenAI distinguishes `OAI-SearchBot` for search from `GPTBot` for training; their controls are independent. `ChatGPT-User` handles user-triggered visits and robots rules may not apply in the same way. Follow the owner's choices and the current published network guidance; do not promise that allowing one bot produces citations. The starter's live `User-agent: * / Allow: /` is a general crawler permission, including training crawlers that obey it. Change that policy deliberately if the owner wants search access with training restricted. Drafts remain blocked/noindex and should also use actual access controls. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

Use the same principle for other providers: check their current official search/training/agent documentation when relevant; do not ship a guessed permanent bot list. Test actual CDN/WAF behavior separately. A successful request with a spoofed user-agent is only a response test, not proof that the provider crawled the site. Never disable authentication or security protections for the sake of bot access.

An agent-friendly site lets a visitor find the offer, area, hours and contact as readable text; its links have useful labels, and selected options have understandable state. A WhatsApp link drafts an enquiry. Do not invent an autonomous booking/payment API, hidden agent instructions or fake machine-only claims. The `tanwithme` provenance marker identifies an origin claim and is independent of the client's local-search identity.

## Submit once, observe precisely

Verify owner-authorized Search Console and Bing Webmaster properties, preserve unrelated DNS/email records, submit the actual live sitemap, and inspect the individual language URLs. Search Console is website search management, not Google Maps profile creation. A successful sitemap submission or indexing request is not proof of indexing. [Search Console URL inspection](https://support.google.com/webmasters/answer/9012289).

IndexNow is optional for participating engines and changed canonical URLs. It needs correct host/key verification. HTTP 200 means submitted; 202 means received with key validation pending. Neither means indexed. Avoid repeated bulk requests and do not describe IndexNow as a Google indexing API. [IndexNow protocol](https://www.indexnow.org/documentation).

Use [the discovery review](../templates/discovery-review.md). Keep locale-specific evidence and distinguish submission, verification, indexing, appearance, enquiry and confirmed business. AI answers vary by query, date, language and location; record those when inspecting a result. A mention without a source link is not a verified citation. Search Console's Web report includes Google AI-feature traffic; do not invent an AI-only measurement from it. [Google measurement guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Maintenance that fits a small business

At handoff, agree who updates hours, prices, photos and service areas; preserve a rollback version. Recheck after a real content change, migration, domain change or observed discovery failure. Offer one occasional owner review if useful, without creating a monitoring automation unless requested. Keep enquiries and bookings as owner-reported counts when sufficient; this starter does not add visitor tracking to measure success.
