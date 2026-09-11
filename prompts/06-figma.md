---
title: 06 — Figma prompt or connected design
updated: 2026-09-07
status: ready-to-copy
tags: [prompt, figma, design]
---

# 06 · Figma Make

Pide al copilot un único prompt listo para pegar en **Figma Make**. No necesitas conectar Figma para prepararlo. Si trabajas con el brief local, `npm run handoff` crea `exports/figma-make-prompt.md` con los textos, colores, comportamiento y requisitos incluidos. Adjunta las fotos autorizadas si las hay. El texto de abajo se lo das a tu copilot; el archivo generado se pega directamente en Make.

~~~text
Ayúdame a convertir el brief de este negocio de Barcelona en un diseño útil para Figma. Responde en mi idioma elegido: catalán, español de España o inglés. Lee bcn-figma-handoff si puedes acceder a la skill.

Por defecto, escribe el prompt para Make sin configurar conectores. Debe dirigirse a Make para construir la web, sin pedirle leer skills ni documentos que no tenga. Incluye todo el contenido y los tokens reales, no solo nombres de archivos. Solo si te pido actuar dentro de Figma, comprueba si tienes una capacidad Figma real y qué puede hacer. Las skills de este repositorio no instalan el conector oficial. Si vas a ejecutar herramientas Figma, carga antes sus instrucciones oficiales obligatorias. No afirmes que has creado un archivo por haber escrito un prompt.

Usa el archivo de destino que yo haya indicado. Si la creación/edición en Figma está dentro de lo que he pedido y hay acceso real, crea una propuesta revisable. Si no hay acceso, entrega un prompt autosuficiente listo para pegar en la función Figma compatible que utilice y un pequeño paquete de contenido/activos. No prometas que cualquier función de Figma acepta el mismo tipo de prompt.

Trabaja con hechos confirmados, una tarea principal del cliente y fotos con permiso. Si falta información decisiva, pregunta como máximo dos cosas y etiqueta el resto como supuestos de borrador.

El diseño o prompt debe especificar:
- Negocio, barrio/zona, público y acción principal.
- La experiencia que queremos provocar, la idea que debemos proteger, una gramática de formas/color/imagen y un ritmo distinto según la función de cada sección. Incluye el método de docs/designer-playbook.md dentro del prompt si está disponible; Make no debe necesitar leer ese archivo.
- Una idea visual concreta, orden de secciones y contenido real. Los colores del sector son ejemplos, no identidad obligatoria.
- Tokens de color, tipografía y espaciado; componentes reutilizables y estados pertinentes.
- Frames móviles y de escritorio, auto-layout y restricciones adaptables cuando la herramienta lo permita.
- Versiones de texto en catalán, español de España e inglés; selector Català · Español · English; comportamiento con textos largos.
- Foco visible, contraste, lectura ordenada y expectativas de teclado para la futura implementación.
- Activos reales, recortes, permisos y texto alternativo previsto.
- Un handoff claro para quien construya la web: secciones, tokens, interacciones, contenido pendiente y prueba de la tarea principal.

No dibujes una reserva confirmada si el botón solo abre una consulta en WhatsApp. No uses reseñas o fotos inventadas como si fueran reales. Mantén cualquier procedencia “tanwithme” en minúsculas; la atribución pública de un cliente requiere aprobación.

Si has ejecutado Figma, entrega el enlace real al archivo/frames y verifica el resultado que puedas inspeccionar. Distingue revisión visual de comprobación de capas/componentes. Un prototipo Figma no es una web publicada.

Termina con una sola recomendación para continuar: corregir una observación, implementar el diseño en el starter local o preparar el handoff compatible. No publiques una web como consecuencia automática de diseñarla.
~~~
