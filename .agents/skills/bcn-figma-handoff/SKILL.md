---
name: bcn-figma-handoff
description: Write actionable Figma prompts and optionally create or inspect Barcelona website designs with the user's available Figma capabilities.
---

# Make Figma work reviewable

This skill defines the project brief and handoff. Official Figma connectors and their mandatory skills are separate dependencies; this repository does not bundle or install them.

## Default: a prompt for Figma Make

When the learner asks to create a site with Figma Make, produce one self-contained prompt addressed directly to Make: build this website, using these facts, copy, visual tokens, responsive behavior and acceptance checks. Do not put instructions to install connectors or read missing repository skills in that prompt. `npm run handoff` produces `exports/figma-make-prompt.md` for supported briefs. For any other site type, adapt the task/sections from the actual requirements and write the prompt directly; the local renderer still supports only its declared sectors.

Include the copy and design token values inside the prompt, and supply permitted images separately. The prompt must work without its recipient reading another document. A Figma connector is optional and is not part of this default path.

## Choose the available mode

- **Prompt mode:** always possible. Deliver a self-contained prompt for the user's chosen Figma AI surface, plus assets and acceptance criteria. Capabilities vary; avoid promising automatic design, code generation or publishing.
- **Connected design mode:** only when the relevant Figma tool is callable and the user has authorized work in a destination file. Load the tool's official prerequisite skills before creating files/designs or editing. Use an existing specified file rather than creating an unrelated one.
- **Inspect/handoff mode:** read the available design or export, record what was actually accessible, then translate it into implementation requirements. A screenshot cannot prove auto-layout, component or variable structure.

## Design brief

Read the approved business facts, customer task, assets, visual direction and language drafts. Request at most two missing inputs that change the design; otherwise label assumptions and make a private draft.

The handoff should specify:

1. Business, neighbourhood/service area and one customer action.
2. Content hierarchy with real copy and clearly marked unknowns.
3. One distinctive visual concept; reusable semantic color/type/spacing tokens.
4. Named desktop and mobile frames, responsive constraints, auto-layout and reusable components where supported.
5. Catalan, Spanish and English text variants, visible language choice and long-label behavior.
6. Default, hover, focus, disabled and error states when relevant; readable contrast and keyboard/focus expectations for implementation.
7. Real asset references, crop directions, alt-text intent and rights status.
8. Developer handoff: sections, tokens, interactions, missing assets and a checklist for the primary customer action.

For a static contact site, design only the contact action the owner can fulfil. Never depict an instant booking confirmation if the implementation only opens an enquiry message. Keep private draft provenance lowercase `tanwithme`; customer-facing/public attribution requires owner approval and belongs in the agreed implementation output.

## Check and hand over

If the tool executes, verify the file/frame links and inspect screenshots at phone/desktop sizes. Check actual layers/components only when the connector exposes them. Correct observed overflow, mismatched locale facts and misleading CTAs. Preserve content-first reading order.

A Figma design or prototype is not a deployed website. Report precisely what exists, what was inspected and how the user reaches the next build step. If only a prompt was produced, call it a prompt and provide the local starter/Sites handoff without claiming a Figma file exists.
