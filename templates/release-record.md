---
title: Registro de revisión y entrega
updated: 2026-09-07
status: blank-template
tags: [template, release, approvals, barcelona]
---

# Registro de revisión y entrega

Este registro acompaña una **versión concreta** de la web. Copia la plantilla a clients/ o private/, carpetas ignoradas por Git, antes de añadir evidencia de un cliente. Conserva el original de las aprobaciones en un lugar privado accesible a quien corresponda.

No hace falta que calcules códigos ni edites JSON a mano. Pide al asistente que complete la parte técnica con los archivos reales y que te explique el resultado. Una casilla marcada no sustituye la revisión ni el permiso.

## 1. Qué estamos revisando

| Dato | Valor real |
| --- | --- |
| Proyecto y negocio | |
| Versión presentada — por ejemplo, v1.0 | |
| Fecha de revisión | |
| Vista previa que se ha revisado | |
| Dominio final acordado, con HTTPS | |
| Commit o copia recuperable de esta versión | |
| Huella de contenido actual, copiada por el asistente | |
| Huella aprobada para esta entrega | |

Una huella o digest es un código que cambia al cambiar el contenido. En este starter vincula la aprobación al brief, incluidas sus referencias de imágenes y aprobaciones. La versión presentada y la versión aprobada deben coincidir.

## 2. Aprobaciones reales

Anota fecha, rol responsable y referencia privada de la evidencia. No publiques nombres, conversaciones ni documentos privados porque el control pida una referencia.

| Revisión | Estado: pendiente / aprobado | Fecha y referencia privada |
| --- | --- | --- |
| Hechos: nombre, oferta, precios, horario, ubicación/cobertura y contactos | | |
| Imágenes: derechos, uso y archivos concretos | | |
| Textos legales y privacidad según el negocio y la plataforma reales | | |
| Catalán: revisión nativa o competente del recorrido completo | | |
| Español: revisión nativa o competente del recorrido completo | | |
| Inglés: revisión nativa o competente del recorrido completo | | |
| Autorización del propietario para publicar esta versión y dominio | | |
| Atribución pública tanwithme: aprobada o desactivada | | |

Los hechos deben coincidir en los tres idiomas. Un texto legal generado, una traducción de IA o una revisión automática no son una aprobación humana. Usa [los requisitos con fuentes](../docs/barcelona-requirements.md) para delimitar lo que necesita revisión.

## 3. Las imágenes que se han visto

Si no hay imágenes, escribe «Sin imágenes» y confirma que esa decisión es intencional. Si las hay, el asistente registra cada archivo final, después de recortarlo o comprimirlo.

| Archivo final | Permiso: referencia privada | SHA-256 de los bytes revisados | Alt ca/es/en revisado |
| --- | --- | --- | --- |
| | | | |

SHA-256 es la huella del archivo exacto. Si se reemplaza la foto manteniendo el nombre, esa huella cambia. No recalcules la huella aprobada para ocultar una sustitución: enseña el nuevo archivo y recoge la revisión que corresponda.

## 4. Qué se ha probado

Registra evidencia breve: fecha, dispositivo/navegador y captura o resultado. Usa «no probado» cuando falte una comprobación.

| Prueba | Resultado y evidencia |
| --- | --- |
| Móvil y ordenador: ca, es y en; sin textos cortados ni desplazamiento horizontal | |
| Una persona encuentra la oferta y realiza la tarea principal sin ayuda | |
| Selector de idioma y enlaces de aviso legal/privacidad | |
| WhatsApp: número correcto y mensaje neutro; se entiende que es una consulta | |
| Alternativa de llamada y mapa/zona de servicio correctos | |
| Teclado, foco, contraste, zoom y alternativas de imágenes | |
| Imágenes visibles, carga lenta y ausencia de dependencia de JavaScript para lo esencial | |
| Recursos externos, solicitudes de red y privacidad revisados en la plataforma usada | |
| Sin datos privados, secretos, reseñas ficticias ni texto de demo en la entrega | |
| Pruebas del proyecto y build de la versión revisada | |
| Procedencia tanwithme, si está activada: publicación/remoción y ausencia de seguimiento | |

Abrir WhatsApp no autoriza a enviar el mensaje de prueba: detente antes de enviarlo salvo que ese envío esté aprobado. Comprueba el destino real en el móvil con el propietario.

## 5. Entrega y recuperación

- [ ] El cliente conoce quién controla el dominio y el alojamiento.
- [ ] Están claros costes, renovaciones y forma de recuperar el acceso.
- [ ] Existe una copia recuperable de los archivos y se conoce cómo restaurarla.
- [ ] Se ha explicado cómo pedir un cambio o realizar la edición acordada.
- [ ] El cliente conoce el alcance de soporte y mantenimiento.
- [ ] La web ofrece únicamente acciones que el negocio puede atender.
- [ ] Los puntos pendientes están resueltos o impiden publicar esta versión.

## 6. Para el asistente: vincular el registro al esquema real

Lee primero el brief y el código actuales. Estas correspondencias reflejan la versión 1 del starter; no añadas campos inventados:

| Evidencia de este registro | Campo existente en site/brief.json |
| --- | --- |
| Versión presentada y aceptada | review.version y review.approvedVersion |
| Vista previa real | review.previewUrl |
| Hechos, derechos, legal y publicación aprobados | approvals.facts, approvals.assets, approvals.legal, approvals.publication |
| Revisión de los tres idiomas | approvals.locales.ca, approvals.locales.es, approvals.locales.en |
| Marca opcional divulgada/aprobada o desactivada | provenance.enabled y approvals.provenance |
| Textos legales revisados | legal.ca, legal.es y legal.en, con notice y privacy |
| Archivos finales, permisos, alt y huellas | assets[].file, rights, approved, alt y sha256 |
| Comprobaciones y entrega realizadas | review.qaPassed y review.ownerHandoffReady |
| Referencias de evidencia no sensibles | review.evidence |
| Huella de contenido aprobada | review.approvedDigest |

No pongas flags en true por esta plantilla. Incorpora únicamente decisiones reales. El modo de entrega exige status live y el origin real, pero esos valores **no prueban que se haya publicado**.

Cuando hechos, imágenes finales, decisiones y revisiones estén cerrados, calcula la huella con el procedimiento del proyecto y vincula la aprobación a esa misma versión. El cálculo excluye el bloque review, pero incluye el resto del brief; cambiar hechos, decisiones o referencias/huellas de imágenes requiere revalidar el estado aprobado.

Ejecuta npm test y las comprobaciones pertinentes. npm run check:release comprueba los requisitos registrados y muestra la huella actual; es de solo lectura y **no verifica por sí solo los bytes de las imágenes**. npm run build:release también comprueba los archivos de imagen al construir y debe pasar antes de entregar el resultado. Ninguno de estos comandos publica la web.

Guarda el resultado real, sin sustituir los fallos por aprobaciones ficticias. Tras una publicación autorizada, comprueba el dominio real y sus tres rutas de idioma, los contactos, las páginas legales y la procedencia si está activada.

## 7. Estado observado

- [ ] Revisado localmente.
- [ ] Publicado y comprobado en el dominio real.
- [ ] Aceptado por el propietario.
- [ ] Probado por una persona que no conocía la web.

Fecha y evidencia de cada estado alcanzado:

Una cosa que aprender para el siguiente proyecto:
