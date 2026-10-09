# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

## [0.1.0] - 2026-10-09

Primera versión, sacada del `ScrollContainer` y el `useScrollOverflow` de mapalab.

### Agregado

- `createScrollEdges`: detecta qué orillas esconden contenido en los ejes `x`, `y` o ambos, con umbral,
  soporte RTL y la medida de los elementos sticky pegados como `inset`.
- `edgeMask`: el estilo `mask-image` que difumina las orillas desbordadas, con intersección de ejes.
- `useScrollEdges` en `scroll-edges/react`: estado, `getContainerProps`, `getAnchorProps`,
  `getArrowProps` y la opción `jump` para que las flechas salten a la orilla a partir de cierto número
  de elementos.
