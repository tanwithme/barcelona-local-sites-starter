# Barcelona local sites · tanwithme

**Think of a business in your neighbourhood. What could a website help them with? Let’s start there.**

[Español](README.md) · [Català](README.ca.md) · [English](README.en.md)

It might be as concrete as finding the price of a haircut or reading a menu on a phone. This pack helps you make a first version, understand the choices and improve it through use. You can start without a client, coding experience or another subscription. The copilot works with you as you learn to offer this as a service.

## Start with the link

In **Codex** or **ChatGPT Work on desktop with local-file access**, paste this:

```text
Set up https://github.com/tanwithme/barcelona-local-sites-starter on my Desktop. Read INSTALL.md and carry out the setup. I'm a beginner: open the project, load AGENTS.md and its skills, check the demo and be my copilot for offering websites to Barcelona businesses. Help me one step at a time, save our progress and prepare complete Figma Make prompts when needed. Don't publish, buy anything or contact anyone during setup.
```

The assistant prepares **Barcelona Sites Studio** with instructions, seven skills, a demo, Figma Make prompts, progress notes and separate client projects. Then it starts your first practice with you. You do not install each skill individually.

You may need to grant access to a folder or select the installed project in the app. If the chat lacks local access, it should guide you into Work/Codex. If this repository is private, you need GitHub access or a ZIP shared by its owner. [What setup does](INSTALL.md)

**To chat without local setup:** download the ZIP, open `START HERE.html` and attach [START-HERE.md](START-HERE.md). That provides the conversational guide; it does not by itself configure a local folder.

**Sites in Barcelona:** as of 7 September 2026, OpenAI's official guide excludes the EEA from the ChatGPT Sites launch. Begin with the local example or a Figma route your account supports. Check availability before paying. [Official source](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)

## Find your next step

- [Learning path in English](docs/learning-path.md#english): practise → owner conversation → draft → review → handover.
- [Help](docs/help.md) and [8 task prompts](prompts/): ask your assistant to explain or adapt them in English.
- [Scope and pricing](docs/scope-and-pricing.md), [client intake](templates/client-intake.md) and [release record](templates/release-record.md).
- [Barcelona requirements](docs/barcelona-requirements.md), [business-site research](docs/research-barcelona.md) and [design system](docs/design-system.md).
- [Sites and Figma](docs/sites-and-figma.md): prepare prompts or execute only through tools actually available.

Includes seven original agent skills, three fictional examples and a static generator without external dependencies. Generated sites work without JavaScript and have complete Catalan, Spanish and English journeys. Example copy has AI review; real content needs competent human language review before publication.

## With a coding assistant

Open this folder and ask: **“Read AGENTS.md. Help me run the demo; don't publish yet.”** With Node.js 22 or newer:

```sh
npm test
npm run build
npm run preview
```

No `npm install` needed. You can also open `demo/index.html` directly without Node. Demo contact details are inactive. `npm run handoff` prepares Sites/Figma files without uploading anything. [Maintainer guide](docs/maintainer-guide.md)

Prices are scope examples, not earnings promises. WhatsApp starts an enquiry; the business must confirm a booking. Public Instagram photos still need reuse permission.

The optional, visible lowercase `tanwithme` marker declares the starter's provenance. It collects no visitor data and cannot discover every Barcelona site. Owners can remove it. [Provenance and research](docs/provenance-and-research.md)

[Validation and limits](docs/validation.md) · [Contributing](CONTRIBUTING.md) · [MIT license](LICENSE)

## Let the business come through

Before choosing colours, listen to how the owner talks and what customers ask. Keep that detail when you design. Two dominant colours, a third with a specific job and type that helps you read can give it shape. Each section needs its own rhythm.

The copilot shows you what it chose and why, so you can say “that works” or “something is missing here” without knowing the technical term. That conversation helps the next version too.

[How we think and talk](docs/studio-voice.md#english--give-someone-something-they-can-work-with) · [Design method](docs/designer-playbook.md) · [Colour and type lab](docs/studio-lab.html) · [Local discovery](docs/local-discovery.md) · [What we learned](docs/voice-learning-audit.md).
