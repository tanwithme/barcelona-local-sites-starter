# ChatGPT Sites and Figma: choose what your account can actually do

Sites availability rechecked 11 September 2026; other provider notes checked 7 September 2026. This repository supplies content, prompts, agent routing and a static implementation. It does not unlock a provider account or silently install a connector.

## Barcelona availability comes first

OpenAI's current Sites FAQ excludes the EEA at launch. Barcelona beginners should use the static route or an available Figma route unless their actual account has legitimate Sites access. Do not buy a subscription expecting this repository to remove regional restrictions. Verify the current official guide; rollout and workspace permissions can change. [OpenAI Sites guide](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)

The same guide distinguishes new private previews from public release and explains that custom domains depend on availability. Existing domain ownership does not make migration automatic. Preserve email DNS and confirm owner access before changing records.

## One-link desktop setup

Paste the repository URL and [setup instruction](../SETUP-PROMPT.md) into Codex or an eligible ChatGPT Work desktop session with local-folder access. The assistant follows [INSTALL.md](../INSTALL.md), creates the studio, reads the installed agent/skill files and starts a practice. Folder permissions and actual app capabilities still apply; a private repository requires access or an owner-shared ZIP. [Official desktop access guide](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)

For a chat-only route, upload `START-HERE.md` or paste it. That gives conversational coaching but does not claim local installation. Add permitted facts/assets only as needed.

## ChatGPT Sites, when available

Use `prompts/05-sites.md` with your brief, or ask your coding assistant to run `npm run handoff` and upload `exports/sites-prompt.md` plus permitted assets.

Ask for a private draft first. If the environment has the official Sites integration, the owning agent follows its installed Sites-building/hosting skills; this pack does not redistribute those platform skills. For an existing static source, retain the project rather than replacing it with a new framework.

The example `.openai/hosting.example.json` declares static output in `dist`. It deliberately contains no project ID. Only after actual Site creation should the owning agent create the ignored `.openai/hosting.json` with the returned `project_id`. Use the installed platform's current packaging/version/deployment tools. Never invent IDs, put source credentials in the repository, or reuse another user's Site.

The generated website has no database, login, customer form or server dependency. Keep it static unless a real task justifies more. Verify that the deployed `/ca/`, `/es/`, `/en/`, legal routes and provenance JSON all resolve, with the intended access. Public release requires the actual business owner and operator's approval. A Sites URL can already be a production deployment; saved source is a different state.

**Fallback:** if the tool cannot preserve the static routes, public manifest, privacy requirements or owner control, keep the draft and use another agreed host. Prompt text cannot guarantee a route exists in the final website.

## Figma Make: the default is a paste-ready prompt

Ask the copilot to prepare the website for Make. `npm run handoff` creates `exports/figma-make-prompt.md`, with the actual copy, all three locales, concrete visual tokens, behavior, draft provenance and acceptance checks embedded. Paste that file's text into Make and attach approved images from `exports/assets/` if present. No Figma connector is needed to write this prompt. The copilot can write the same style of complete prompt for other site types; it must not imply that the static generator already supports those types.

## Figma Design: optional editable design route

Use `prompts/06-figma.md`, selecting Design. With a capable installed connector, ask the agent to inspect/create the authorised Figma file using its official Figma skills, then create editable auto-layout frames, semantic variables and reusable components. Require returned file/node links and actual screenshots. Do not accept a textual claim that a file was created.

Without a connector, paste the structured design brief into the available Figma AI surface or implement the specification manually. Keep the six core page views (mobile/desktop in ca/es/en), long-text and focus annotations. Layout work in Figma does not certify accessible HTML or create a live site.

## Figma Make: functional draft, then verify

Select Make in `prompts/06-figma.md`. Ask for the content and one primary action before adding animation or integrations. Use native language links and shared facts. Inspect the resulting runtime, legal pages, network behaviour and ownership workflow.

Figma documents code downloads and GitHub export; do not assume local code changes automatically sync back into Make. [Figma Make code/export guide](https://help.figma.com/hc/en-us/articles/35710574222487-Beyond-the-basics-Using-Figma-Make)

Publishing settings support metadata and custom head/body code, with account-dependent access. A `tanwithme` meta tag is useful evidence of provenance, but the stronger scanner also needs the exact public JSON route. If Make cannot serve it, record “marker-only / unverified”, or export the code and use the static route. [Figma Make publishing](https://help.figma.com/hc/en-us/articles/31304586129559-Publish-update-or-unpublish-a-Figma-Make-file)

## A handoff that survives changing tools

Carry the brief, current design direction, files/assets, current test state and remaining owner decisions. `npm run handoff` produces a direct Make build prompt plus two assistant handoff prompts, `content.json`, concrete design tokens and copies of approved image files. A handoff creates a new draft that needs its own rendered review. It excludes private approval evidence from the content payload. Source assets still need an actual file attachment or authorised accessible location.

No connector is an excuse to fabricate a completed action. Missing access changes the route; it should not end the learner's ability to practise.
