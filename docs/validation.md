---
title: What has actually been checked
updated: 2026-09-07
status: local-validation
tags: [barcelona, validation]
---

# Evidence and remaining tests

This is an initial starter release. Its examples are fictional. It has not earned client acceptance or demonstrated income, conversion improvement, native-language acceptance or production reliability through use.

## Local implementation

- The Node test suite covers malformed/missing multilingual input, shared prices, escaped copy, unsafe URL schemes, WhatsApp encoding, live-release gating, changed content, explicit all-week/split/midnight hours, optional marker removal, protected output replacement and actual image-byte digest checks.
- Handoff checks cover source release validation, a public-field allowlist, new-builder draft status, preservation of legal copy, concrete design tokens and output-path protection.
- Scanner tests use mocked network and DNS. They cover exact lowercase/schema/origin checks, draft/approval rejection, private-address and redirect blocking, time/size limits and distinct result states. No real client website was scanned or contacted.
- Restaurant, barber and trades example briefs are checked against the supported schema and intended section order.
- The demo build, ordinary build and Sites/Figma handoff run locally. The release check deliberately rejects the fictional demo because real facts, legal text, owner approval, language review, domain and QA evidence are missing.

Run `npm test` for the current count/results. The initial suite has 25 tests. GitHub Actions runs the suite, builds the site/handoff and checks that the committed demo matches the source. The Actions run is separate evidence: inspect its result on GitHub rather than treating this document as a live CI badge.

The initial local documentation/demo link audit checked 243 relative links with no missing files or HTML anchors.

## Browser checks

The local restaurant demo was opened in Chromium at 390, 768, 1024 and 1440px in each of ca/es/en. All 12 combinations had no horizontal overflow and contained no scripts. Mobile and desktop rendered screenshots were visually inspected. The first keyboard focus reaches the visible skip link. A Spanish legal-page navigation followed by the Catalan switch preserved the legal route and correct document language.

The offline welcome/library opens directly from disk. Its prompt controls have both a copy path and manual text-selection fallback. The copy API is mocked during the check so the user's real clipboard is untouched; this does not prove every browser's clipboard permission behavior. Native textareas remain selectable with scripts disabled.

These checks are bounded. They are not an accessibility certification, complete device/browser matrix, real WhatsApp/directions interaction or continuous human reading of every page.

## Learning and source review

An independent AI agent exercised a Catalan beginner scenario: no client, Free account and uncertainty. The coach proposed one fictional barber-copy task, avoided payment/outreach pressure and retained the Barcelona Sites restriction. This checks one instruction path; a real beginner may expose other friction.

The supplied video's full existing caption transcript was reviewed and rendered frames were sampled. It was not continuously watched with audio in this pass. Private media and raw history are excluded from the repository. The business-reference research labels source observations, inference and verification limits separately.

## The next human test

Give one beginner the ZIP and only the first README instruction. Observe whether they can begin a fictional exercise without help from the maintainer. Then, with one consenting owner and competent Catalan, Spanish and English readers, check the real draft's facts, natural copy, main action and edit/rollback handoff. Keep the first point of confusion and use it to improve the next version.

Sites and Figma adapters are prepared; no Figma design file or ChatGPT Site was created as part of this starter. Regional/account availability and actual deployed endpoint behavior remain provider-specific checks.
