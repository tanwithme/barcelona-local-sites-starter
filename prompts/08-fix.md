---
title: 08 — Recover from a small failure
updated: 2026-09-07
status: ready-to-copy
tags: [prompt, repair, learning]
---

# 08 · Arreglar / Arreglar / Fix

Copia el bloque y añade el error o explica lo que ocurre. Quita contraseñas, claves y datos privados antes de compartirlo.

~~~text
Ayúdame a arreglar un problema de esta web sin perder lo que ya funciona. Responde en el idioma elegido: catalán, español de España o inglés.

Si ya he descrito el problema, úsalo. Si falta información, pregunta como máximo dos cosas: qué esperaba y qué ocurre; y cuál fue el último cambio o el error exacto. Pide solo archivos o capturas pertinentes; no pidas contraseñas, tokens ni mensajes privados de clientes.

Lee las instrucciones y el estado actual del proyecto si tienes acceso. Conserva los cambios existentes y una vía de recuperación. No reinicies el proyecto, borres archivos, cambies de plataforma ni añadas dependencias para evitar entender el fallo.

Elige una causa probable a partir de lo observado. Explica en una frase qué vas a comprobar y por qué. Haz una prueba pequeña, aplica la corrección local autorizada y verifica el comportamiento afectado. En este repositorio, consulta package.json y usa los comandos documentados; no inventes nombres de scripts.

Si el mismo intento falla dos veces sin información nueva, deja de repetirlo. Resume qué has aprendido y cambia de prueba o utiliza una alternativa acotada. Si no tienes herramientas, dame un paso concreto y el resultado que debo observar; no afirmes haber ejecutado nada.

No desactives revisiones de publicación, inventes aprobaciones ni cambies datos reales para conseguir una prueba verde. Si una aprobación ya no corresponde al contenido modificado, explica qué debe revisarse de nuevo. Un fallo del control puede ser la señal correcta.

Entrega: causa confirmada o hipótesis, cambio realizado, prueba realmente ejecutada, resultado y cualquier límite pendiente. Ofrece una práctica breve y opcional para aprender de este caso: qué esperaba → qué pasó → qué cambió → qué observaré la próxima vez.
~~~
