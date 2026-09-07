---
title: 05 — Conditional ChatGPT Sites handoff
updated: 2026-09-07
status: ready-to-copy
tags: [prompt, sites, handoff]
---

# 05 · Sites, si está disponible / Sites, si està disponible / Sites, when available

**Barcelona:** la [FAQ oficial de OpenAI](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites), consultada el 7 de septiembre de 2026, excluye el EEE, Suiza y Reino Unido en el lanzamiento de ChatGPT Sites; también Free/Go. Este prompt prepara una alternativa útil aunque tu cuenta no tenga acceso. Comprar Plus/Pro no elimina por sí solo la restricción regional.

~~~text
Prepara una web para este negocio de Barcelona con una ruta de Sites solo si existe una capacidad real disponible en mi cuenta y región. Responde en el idioma elegido: catalán, español de España o inglés.

Primero distingue entre ChatGPT Sites y cualquier otro constructor conectado. Comprueba las capacidades reales; no deduzcas que existen por haber leído este prompt. Revisa la FAQ oficial actual de ChatGPT Sites si tienes acceso. La referencia consultada el 7 de septiembre de 2026 excluía España/EEE en el lanzamiento y Free/Go: no prometas que una suscripción o una VPN resuelven el acceso.

Lee el brief, las imágenes autorizadas y la skill bcn-sites-handoff si están disponibles. Si falta algo decisivo, haz como máximo dos preguntas y continúa con un borrador privado. Si este repositorio está accesible, inspecciona sus instrucciones y usa npm run handoff para preparar los archivos de intercambio cuando corresponda; no afirmes que has ejecutado el comando sin hacerlo.

Si no hay capacidad compatible, entrega un único prompt listo para pegar en una cuenta/superficie compatible y una alternativa inmediata con el generador estático local. El prompt debe contener los datos del negocio, tarea principal, estructura, dirección visual, textos ca/es/en, imágenes y permisos, contacto, comportamiento móvil y criterios de revisión. No dependas de enlaces privados a archivos que el siguiente asistente no podrá leer.

Si sí hay una capacidad compatible y está autorizada su utilización, carga primero las instrucciones oficiales de la herramienta y crea una vista previa siguiendo su procedimiento. No inventes herramientas, URLs ni resultados.

Pide una web ligera con selector Català · Español · English, hechos coherentes, enlaces de contacto y una alternativa al destino principal. No añadas cuentas, formularios, bases de datos, analítica ni feeds de Instagram por defecto. Usa imágenes originales con permiso.

Incluye la procedencia opcional “tanwithme”, siempre en minúsculas. En un sitio público de un cliente requiere divulgación y aprobación del propietario; en un borrador privado puede figurar como procedencia del proyecto. Usa solo un manifiesto estático público y/o metadatos HTML que la plataforma permita. No añadas balizas, llamadas de seguimiento ni identificadores personales. Un marcador solo en el prompt o en JSON privado no es detectable públicamente.

Comprueba qué marcador conserva realmente la plataforma. Si no admite metadatos/manifiesto, indica la limitación y prepara una alternativa compatible, como un crédito público aprobado. No prometas que un buscador encontrará todos los sitios.

Entrega el archivo o vista previa real, qué has podido comprobar, qué requiere revisión y el siguiente paso. Antes de publicar, realiza la revisión de entrega y usa solo la autorización existente o solicita la decisión concreta que falte.
~~~
