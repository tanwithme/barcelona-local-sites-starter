# Barcelona local sites · tanwithme

**Tu primera web útil para un negocio de Barcelona. Una conversación, un problema real y un paso cada vez.**

[Español](README.md) · [Català](README.ca.md) · [English](README.en.md)

Para gente que empieza con IA. Puedes practicar sin cliente, sin comprar otra suscripción y sin saber programar. El objetivo es aprender a entregar una web que una persona pueda usar y un negocio pueda mantener.

## Empieza aquí — sin terminal

1. Pulsa **Code → Download ZIP** y descomprime la carpeta.
2. Abre **START HERE.html** para recorrer el pack. Para hablar con tu IA, adjunta [START-HERE.md](START-HERE.md) o pega su contenido.
3. Escribe: **«Quiero empezar en español. No tengo cliente. Ayúdame a practicar con una barbería ficticia y dame solo el siguiente paso.»**

Puedes preguntar cualquier cosa. El asistente debe explicar lo necesario, reconocer lo que no sabe y ayudarte a avanzar. Un archivo no instala herramientas ni activa una cuenta de pago.

**Sites en Barcelona:** a 7 de septiembre de 2026, la guía oficial de OpenAI excluye el EEE del lanzamiento de ChatGPT Sites. Empieza con el ejemplo local o con una ruta de Figma disponible en tu cuenta. Revisa la disponibilidad antes de pagar. [Fuente oficial](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)

## Qué tienes

| Quiero… | Abre… |
| --- | --- |
| Empezar o entender un error | [Guía para conversar](START-HERE.md) · [Ayuda](docs/help.md) |
| Aprender a mi ritmo | [Camino en español, català y English](docs/learning-path.md) |
| Copiar un prompt concreto | [8 prompts](prompts/) |
| Hablar con un negocio y acordar el trabajo | [Alcance y precio](docs/scope-and-pricing.md) · [Ficha breve](templates/client-intake.md) |
| Decidir qué necesita la web | [Mínimos de Barcelona](docs/barcelona-requirements.md) · [Referencias investigadas](docs/research-barcelona.md) |
| Diseñar con intención | [Sistema adaptable](docs/design-system.md) |
| Usar Sites o Figma | [Rutas y límites reales](docs/sites-and-figma.md) |
| Revisar antes de entregar | [Registro de revisión](templates/release-record.md) |
| Entender la marca tanwithme | [Procedencia e investigación](docs/provenance-and-research.md) |

Hay cinco habilidades originales para agentes, tres ejemplos ficticios y un generador estático sin dependencias externas. La web funciona sin JavaScript y genera recorridos completos en catalán, español e inglés. Las traducciones de ejemplo son borradores revisados por IA; una persona competente debe revisar el contenido real antes de publicar.

## Si tienes un asistente de programación

Abre esta carpeta y pídele: **«Lee AGENTS.md. Ayúdame a ejecutar la demo; todavía no publiques nada.»** Necesita Node.js 22 o posterior. No hace falta ejecutar `npm install`.

```sh
npm test
npm run build
npm run preview
```

Abre la dirección local que imprima. También puedes abrir `demo/index.html` directamente sin Node. La demo carece de contactos reales: verás lo que falta, sin botones que escriban a otra persona.

El agente puede editar `site/brief.json`, basarse en `examples/restaurant.json`, `examples/barber.json` o `examples/trades.json`, y ejecutar `npm run handoff` para preparar prompts y contenido para Sites/Figma. [Guía técnica breve](docs/maintainer-guide.md)

## Crece cuando el trabajo lo necesite

Primero una práctica → después una conversación con un dueño → un borrador acordado → contenido y tres idiomas revisados → una entrega con control del dueño. Formularios, pagos, reservas y automatizaciones llegan cuando hay una necesidad observada y un presupuesto para mantenerlos.

Las cifras de precio son ejemplos para acotar un encargo, no promesas de ingresos. WhatsApp facilita una consulta; el negocio sigue teniendo que confirmar una reserva. Las imágenes públicas de Instagram necesitan permiso de reutilización.

La marca opcional y visible `tanwithme` permite comprobar una declaración de procedencia en sitios candidatos. No rastrea visitas ni encuentra por sí sola todas las webs de Barcelona. Se puede quitar y no es condición de la licencia.

## Estado y contribuciones

Este repositorio entrega una herramienta de inicio y ejemplos, no una web comercial aprobada ni una integración externa ya ejecutada. [Comprobaciones y límites](docs/validation.md) · [Cómo contribuir](CONTRIBUTING.md) · [Licencia MIT](LICENSE).
