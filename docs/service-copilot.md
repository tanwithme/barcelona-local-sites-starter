---
title: Your small website service, with a copilot
updated: 2026-09-07
status: ready-to-practise
tags: [business, copilot, novice, barcelona]
---

# Build a service you can understand and maintain

Tell the assistant what you want in español, català or English. It should do the technical setup, explain useful choices and help you practise without making you pass a course first.

## Things you can say

| Say this | The copilot should do |
| --- | --- |
| “I have no experience. Start with me.” | Open a fictional demo and help improve one useful piece of copy. |
| “I met a barber who might want a website.” | Clarify the customer's problem and prepare a short owner conversation. |
| “Help me charge for this.” | Draft a bounded offer, costs and payment terms; distinguish an example from an agreed price. |
| “Create a new client project.” | Make an isolated folder from the untouched starter, with fresh facts/approval requirements. |
| “Give me the prompt for Figma Make.” | Produce one paste-ready prompt with real copy, visual direction, locale content and behavior; no connector required. |
| “The owner wants changes.” | Check agreed scope, fix an error or price additional work, and show a new reviewable version. |
| “Continue where we stopped.” | Read the current project notes, explain the last actual result and take the next useful step. |
| “I'm lost.” | Reduce the task to one action and explain what success looks like. |

The assistant does not run your business while the app is closed. It works in conversation, using saved files to continue. It should not promise an income, client, reply, booking or renewal that has not happened.

## The workspace

- `COPILOT.md`: where you are, decisions, checks and one next action.
- `LESSONS.md`: a short record of useful mistakes and improvements.
- `CLIENTS.md`: project labels, stage and next action; no customer contact database.
- `clients/`: separate project folders, each with its own brief, code, exports and progress notes.
- `.agents/skills/` and `AGENTS.md`: instructions the assistant uses while working here.
- `.starter-template/`: a checked copy of the original starter, used only to create fresh projects. It never copies a previous client's brief or approvals.

Your working notes, client folders and the snapshot are ignored by the starter's Git settings. Inspect before publishing any source: ignored files are not encrypted, and app/task context may still be processed by the provider. Do not paste private customer messages or account secrets into routine notes.

## One practical loop

**Understand → agree → build → review → deliver → maintain → learn.**

Use [client intake](../templates/client-intake.md) for actual owner needs, [scope and pricing](scope-and-pricing.md) for a small offer and [service-offer.md](../templates/service-offer.md) to write the agreed terms. Track time and direct costs while working. A quoted €500 is not €500 received, and revenue is not profit. Review the actual outcome before changing prices or subscribing to more tools.

Before publishing, use [release-record.md](../templates/release-record.md). Give the owner control of their domain and hosting, disclose renewals and retain a recoverable version. Support should have a defined request channel, response window and included changes; no “unlimited edits” unless you can support and price them.

After delivery, use [maintenance-note.md](../templates/maintenance-note.md) when a change is requested. No ongoing fee is automatic. Agree the service and obtain authorization before billing or making commitments. For invoices, tax registration and legal obligations, get current local guidance; this pack does not determine your personal tax status.

## For the assistant operating the studio

Run from the studio folder:

```sh
npm run client -- --name gracia-barber --sector barber --language ca
```

The label is an internal project name. The created brief is **fictional practice**, with no inherited business facts or approval. When the owner provides facts, replace the sample content, set status to `draft` and follow the real review process. Open that client folder before building or exporting. Never run the release command merely to clear a red check.

Keep the source pack as a reference. Installation is repeatable and preserves existing work; it is not an updater. For an update, obtain a fresh starter separately, compare relevant changes, retain a backup and apply only the changes needed. Never overwrite client folders or progress notes with a fresh ZIP.
