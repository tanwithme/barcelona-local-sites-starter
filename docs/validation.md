---
title: What has actually been checked
updated: 2026-09-07
status: local-validation-v1.1
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

Run `npm test` for the current count/results. The original suite had 25 tests. Version 1.1 adds setup and client-isolation coverage; run the suite for its current count. GitHub Actions runs the suite, builds the site/handoff and checks that the committed demo matches the source. The Actions run is separate evidence: inspect its result on GitHub rather than treating this document as a live CI badge.

The version 1.1 local documentation/demo audit checked 260 relative links with no missing files or HTML anchors. The offline setup message matches its copyable source exactly.

## Desktop setup added in version 1.1

The actual setup command created a fresh studio in a separate test directory with a Desktop-style path containing spaces. Doctor confirmed the six skills, agent instructions, progress notes, built demo and direct Figma Make prompt. The client command created a fresh Catalan barber practice with its own outputs. Its installed preview was opened in Chromium at 390px: Catalan document language, barber theme, stylesheet loading and no horizontal overflow were verified. Repeat setup, existing-folder protection, changed source, symlinks, failed-build cleanup and client isolation have automated regression coverage. A Mac case-insensitive filename collision was found during packaging and corrected by using a distinct `starter-manifest.json` name; case-equivalent package paths are rejected.

The new skill's required frontmatter fields and structure were checked. The official Python validator could not run because PyYAML was absent; the narrow structural check is not a full YAML or behavior validator.

This proves local installation/build behavior in the test environment. It does not prove a new person's account access, native skill registration in every client, a real beginner's understanding or unattended business operations. `INSTALL.md` requires the receiving assistant to select/read the installed workspace, report actual checks and begin a small practice. Saved project notes support the next conversation; no background agent is installed.

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
