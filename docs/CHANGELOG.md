# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

### Cambiado

- El `demo.gif` del README se regrabó con las sombras de orilla de la 0.2.

## [0.2.0] - 2026-10-19

### Agregado

- Sombras de orilla como alternativa a la máscara: opción `shadow` (`true` o `{ size, color }`) y
  `getShadowProps(edge)` en `useScrollEdges`, y `edgeShadow(edge, visible, options)` en el core. La
  sombra vive dentro del ancla, sigue el `inset` sticky y no difumina los encabezados fijos.
- El demo muestra las sombras en la lista con encabezado sticky.

## [0.1.1] - 2026-10-19

### Agregado

- Demo en Vite (`npm run demo`) con una lista de header sticky, una lista con `edgeMask` y una fila
  horizontal, publicada en GitHub Pages.
- Pruebas e2e en Playwright (`npm run e2e`): orillas al desplazar, `inset.top` bajo el header,
  máscara y flechas que saltan.
- `release.yml`: un tag `vX.Y.Z` corre las pruebas, crea el release con su sección del CHANGELOG y
  publica en npm con procedencia y en GitHub Packages.

### Cambiado

- El lint usa `@ghegar/eslint-config` (presets `base`, `react` y `ts`) en lugar de una config propia.
- El demo usa los íconos de tesela.

## [0.1.0] - 2026-10-09

Primera versión.

### Agregado

- `createScrollEdges`: detecta qué orillas esconden contenido en los ejes `x`, `y` o ambos, con umbral,
  soporte RTL y la medida de los elementos sticky pegados como `inset`.
- `edgeMask`: el estilo `mask-image` que difumina las orillas desbordadas, con intersección de ejes.
- `useScrollEdges` en `scroll-edges/react`: estado, `getContainerProps`, `getAnchorProps`,
  `getArrowProps` y la opción `jump` para que las flechas salten a la orilla a partir de cierto número
  de elementos.
