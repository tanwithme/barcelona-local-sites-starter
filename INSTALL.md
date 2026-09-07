---
title: One-link desktop setup
updated: 2026-09-07
status: executable-setup
tags: [setup, beginner, desktop, copilot]
---

# Assistant: set up my Barcelona website studio

The user who asks you to set up this repository is authorizing its local setup. Read this file and inspect the setup scripts before running them. Complete ordinary local steps without asking the person to approve each one. The goal is a working folder, an accessible practice site and a helpful copilot—not a list of commands for a novice to figure out.

Repository: https://github.com/tanwithme/barcelona-local-sites-starter

## 1. Check actual access, then act

Work in the user's chosen Catalan, Spanish or English. Infer it from their message; default to Spanish only with no signal. Determine whether this session can read/write local files and execute commands. Do not infer permission or availability from the app name.

- **Local access available:** continue with setup. Use the current granted project or the actual Desktop folder. If the user requested Desktop and that location needs app/OS permission, explain the one permission needed and resume after it is granted. Never bypass a restriction.
- **Chat without local access:** explain the exact limitation once. In the current ChatGPT desktop app, direct them to **Work with local-folder access or Codex**, subject to their account/workspace permissions, then give them the same repository link and setup instruction to paste there. Continue useful conversation meanwhile. Do not claim a ZIP in a cloud sandbox is installed on their computer.
- **Repository inaccessible:** use the user's existing GitHub connection/authenticated Git if available. If it is private and they have no access, ask for a shared ZIP or repository access. Do not request tokens in chat. Never invent repository contents or search unrelated private files.

Current product references, checked 7 September 2026: [Work and Codex local folders](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex), [local skills](https://learn.chatgpt.com/docs/build-skills), [AGENTS.md loading](https://learn.chatgpt.com/docs/agent-configuration/agents-md). Exact UI/account access can change; verify the actual environment.

## 2. Obtain and inspect the source

Download/clone this exact repository into a temporary or Downloads source folder. Use authenticated Git for a private repository, or download the repository ZIP and extract it with your available file tools. ZIP downloads must preserve dot folders such as `.agents`; do not flatten the structure. Never place credentials in a URL or command pasted into a conversation.

Read `tools/setup.mjs`, `tools/setup-lib.mjs`, `starter-manifest.json` and `package.json`. This setup copies a checked list of starter files into a new workspace, builds the practice site and Figma Make prompt, and writes progress notes. It does not install paid services, modify global agent configuration, send messages or publish a website. The manifest's hashes detect incomplete/changed source; they do not independently authenticate its author.

Find Node.js 22 or newer. If the app has a bundled runtime, use it. Otherwise use a compatible installed runtime. If missing, help with the official [Node.js installer](https://nodejs.org/en/download) as the one required prerequisite, subject to device permissions. Do not recommend a paid AI plan for this. Git is optional after obtaining the ZIP. The repository pins text files to LF line endings with `.gitattributes` so manifest hashes survive normal Windows checkouts. No `npm install` is needed.

## 3. Run the setup, don't make the novice operate it

Resolve the user's real Desktop location, including redirected/OneDrive/localised locations. Use a new folder named **Barcelona Sites Studio** there; use the already granted folder or a requested destination when appropriate. Do not place AGENTS.md in the whole Desktop or home directory.

Run from the downloaded repository (substitute the actual absolute path and language):

```sh
node tools/setup.mjs --target "/actual/Desktop/Barcelona Sites Studio" --language es
```

Use `ca` or `en` for those languages. Quote paths correctly for the operating system. Default invocation uses the conventional `~/Desktop/Barcelona Sites Studio`; pass `--target` when the real Desktop differs.

The installer preserves any existing installation, refuses unrelated existing folders and validates source hashes before creating output. Do not force-overwrite on a collision. For a successful repeat, read the existing progress and run doctor. If setup stops, explain the actual cause and fix that cause. Do not mark it installed after a failed command.

## 4. Activate this workspace and verify it

Open the installed folder as the active local project, using an app tool if available. If selecting a folder requires the user's click, give one clear instruction and then continue. Merely changing a terminal's directory does not necessarily change the app's active project or instruction context.

Read the installed `AGENTS.md`, `COPILOT.md`, `.agents/skills/bcn-business-copilot/SKILL.md` and `.agents/skills/bcn-site-coach/SKILL.md` now. Codex discovers repo/folder skills according to its current rules; if discovery is not available in this client, read relevant files explicitly. Never claim native registration merely because files exist. A fresh task in this folder can refresh stale instructions. Keep skills scoped to this studio; do not change global user settings.

Run `npm run doctor` in the installed folder (or run its Node script through the available runtime). If it reports missing output, run `npm run build` and `npm run handoff`, then check again. Open `dist/index.html` directly, or use `npm run preview` and the exact localhost address it prints. Use an actual browser if available to inspect the demo. Stop any temporary server when it is no longer needed.

Give a concise receipt: actual folder, file checks passed/failed, which instructions you really read, whether the demo was viewed, and any one remaining access step. Do not imply that the person's other devices or future unscoped chats were configured.

## 5. Start being their copilot immediately

The setup already contains a fictional practice. Do not ask them to read all the folders. If they have no client, show the demo and help improve one headline for one visitor. If they have a client, establish the main customer task, then create an isolated project through `npm run client -- --name project-label --sector barber --language es`. Supported seeds are barber, restaurant and trades; other site types can use a tailored Figma Make prompt or an explicit generator extension.

Explain one decision and offer one small learner action. Save meaningful progress in `COPILOT.md`, learning in `LESSONS.md` and project status in the studio's `CLIENTS.md`. Read those notes when they return. Read `docs/service-copilot.md` when moving toward an offer, production, delivery or maintenance. No background process is installed: continuity comes from these files and the next conversation.

Figma Make is **prompt-first**. Use `exports/figma-make-prompt.md` for the current supported brief and attach the approved images from `exports/assets/` if present. It can be written without a Figma connection. A new Make result still needs its own review. Client communications, purchases and publishing happen only within their actual authorization.
