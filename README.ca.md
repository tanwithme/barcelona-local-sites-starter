# Barcelona local sites · tanwithme

**El teu primer web útil per a un negoci de Barcelona. Una conversa, un problema real i un pas cada vegada.**

[Español](README.md) · [Català](README.ca.md) · [English](README.en.md)

Pots començar sense client, sense una altra subscripció i sense saber programar.

## Comença amb l'enllaç

A **Codex** o **ChatGPT Work d'escriptori amb accés als fitxers locals**, enganxa això:

```text
Configura https://github.com/tanwithme/barcelona-local-sites-starter al meu Escriptori. Llegeix INSTALL.md i fes la configuració. Soc principiant: obre el projecte, carrega AGENTS.md i les skills, comprova la demo i acompanya'm com a copilot per oferir webs a negocis de Barcelona. Ajuda'm pas a pas, desa el nostre progrés i prepara prompts complets per a Figma Make quan els necessiti. No publiquis, compris ni contactis amb ningú durant la configuració.
```

L'assistent prepara **Barcelona Sites Studio** amb instruccions, sis skills, una demo, prompts per a Figma Make, notes de progrés i projectes separats per a cada client. Després comença amb tu una primera pràctica. No cal instal·lar les skills una per una.

Pot caldre autoritzar una carpeta o seleccionar el projecte a l'app. Si el xat no té accés local, t'indicarà com continuar a Work/Codex. Si el repositori és privat, cal accés de GitHub o el ZIP compartit pel propietari. [Què fa la configuració](INSTALL.md)

**Per conversar sense configurar res:** descarrega el ZIP, obre `START HERE.html` i adjunta [START-HERE.md](START-HERE.md) al xat. Això et dona la guia, però per si sol no configura una carpeta local.

**Sites a Barcelona:** el 7 de setembre de 2026, la guia oficial d'OpenAI exclou l'EEE del llançament de ChatGPT Sites. Comença amb la versió local o una ruta de Figma disponible al teu compte. Comprova la disponibilitat abans de pagar. [Font oficial](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)

## Tria el pas que necessites

- [Camí d'aprenentatge en català](docs/learning-path.md#català): pràctica → conversa amb el negoci → esborrany → revisió → lliurament.
- [Ajuda](docs/help.md) i [8 prompts](prompts/): demana que te'ls expliquin o adaptin en català.
- [Abast i preu](docs/scope-and-pricing.md), [fitxa del negoci](templates/client-intake.md) i [revisió](templates/release-record.md).
- [Requisits de Barcelona](docs/barcelona-requirements.md), [recerca de referents](docs/research-barcelona.md) i [sistema de disseny](docs/design-system.md).
- [Sites i Figma](docs/sites-and-figma.md): què pots preparar i què depèn de l'accés real.

Inclou sis habilitats originals per a agents i tres exemples ficticis. Els webs generats funcionen sense JavaScript i tenen recorreguts en català, castellà i anglès. Els textos d'exemple són esborranys revisats per IA; cal revisió humana competent del contingut real abans de publicar-lo.

## Per a un assistent de programació

Obre aquesta carpeta i escriu: **«Llegeix AGENTS.md. Ajuda'm a executar la demo; encara no publiquis res.»** Amb Node.js 22 o posterior:

```sh
npm test
npm run build
npm run preview
```

No cal `npm install`. També pots obrir `demo/index.html` sense Node. La demo no té contactes reals. `npm run handoff` prepara els fitxers per a Sites/Figma sense pujar-los. [Guia tècnica](docs/maintainer-guide.md)

Els preus proposats són exemples, no promeses d'ingressos. WhatsApp serveix per fer una consulta; el negoci ha de confirmar la reserva. Les fotos d'Instagram requereixen permís de reutilització.

La marca opcional i visible `tanwithme` declara la procedència del pack. No recull dades de visites ni permet trobar tots els webs de Barcelona. El titular pot demanar que es retiri. [Com funciona](docs/provenance-and-research.md)

[Comprovacions i límits](docs/validation.md) · [Contribucions](CONTRIBUTING.md) · [Llicència MIT](LICENSE)

## Dissenyar amb caràcter

El copilot preserva la idea del negoci, tria una direcció coherent i revisa el web real. Aprèn una decisió cada vegada. [Design method](docs/designer-playbook.md) · [Three worked directions](docs/design-worlds.md) · [What changed](docs/design-learning-audit.md). The detailed references are in English; the copilot explains and applies them in your chosen language.
