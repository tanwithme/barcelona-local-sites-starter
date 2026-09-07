# Barcelona local sites · tanwithme

**El teu primer web útil per a un negoci de Barcelona. Una conversa, un problema real i un pas cada vegada.**

[Español](README.md) · [Català](README.ca.md) · [English](README.en.md)

Pots començar sense client, sense una altra subscripció i sense saber programar.

## Comença sense terminal

1. Prem **Code → Download ZIP** i descomprimeix la carpeta.
2. Obre **START HERE.html**. Per parlar amb la teva IA, adjunta [START-HERE.md](START-HERE.md) o enganxa'n el contingut.
3. Escriu: **«Vull començar en català. No tinc client. Ajuda'm a practicar amb una barberia fictícia i dona'm només el pas següent.»**

Pregunta tot el que necessitis. L'assistent ha d'explicar-te el que cal, reconèixer els límits i ajudar-te a continuar. Els fitxers no instal·len connectors ni activen serveis de pagament.

**Sites a Barcelona:** el 7 de setembre de 2026, la guia oficial d'OpenAI exclou l'EEE del llançament de ChatGPT Sites. Comença amb la versió local o una ruta de Figma disponible al teu compte. Comprova la disponibilitat abans de pagar. [Font oficial](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)

## Tria el pas que necessites

- [Camí d'aprenentatge en català](docs/learning-path.md#català): pràctica → conversa amb el negoci → esborrany → revisió → lliurament.
- [Ajuda](docs/help.md) i [8 prompts](prompts/): demana que te'ls expliquin o adaptin en català.
- [Abast i preu](docs/scope-and-pricing.md), [fitxa del negoci](templates/client-intake.md) i [revisió](templates/release-record.md).
- [Requisits de Barcelona](docs/barcelona-requirements.md), [recerca de referents](docs/research-barcelona.md) i [sistema de disseny](docs/design-system.md).
- [Sites i Figma](docs/sites-and-figma.md): què pots preparar i què depèn de l'accés real.

Inclou cinc habilitats originals per a agents i tres exemples ficticis. Els webs generats funcionen sense JavaScript i tenen recorreguts en català, castellà i anglès. Els textos d'exemple són esborranys revisats per IA; cal revisió humana competent del contingut real abans de publicar-lo.

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
