# scroll-edges

Headless scroll overflow for React. scroll-edges tells you which edges of a scroll container hide
content, how tall the stuck sticky header is, and gives you props for arrows that jump to an edge and an
optional edge mask. It ships no styles: only state, `data-*`/ARIA attributes and functional inline style.

```bash
npm install scroll-edges
```

```tsx
import { useScrollEdges } from 'scroll-edges/react';

function List({ items }: { items: string[] }) {
    const edges = useScrollEdges({ jump: { items: items.length, min: 3 }, mask: true });
    return (
        <ul {...edges.getContainerProps({ className: 'list' })}>
            <li {...edges.getAnchorProps('top')}>
                {edges.state.top && <button {...edges.getArrowProps('top')}>↑</button>}
            </li>
            {items.map((item) => <li key={item}>{item}</li>)}
            <li {...edges.getAnchorProps('bottom')}>
                {edges.state.bottom && <button {...edges.getArrowProps('bottom')}>↓</button>}
            </li>
        </ul>
    );
}
```

## Options

| Option | Default | |
|---|---|---|
| `axis` | `'y'` | `'x'`, `'y'` or `'both'` |
| `threshold` | `1` | Pixels of slack before an edge counts as overflowing |
| `sticky` | `'[data-sticky]'` | Selector of sticky elements whose size becomes `state.inset`; `false` to skip |
| `jump` | `false` | `true`, or `{ items, min }` to make the arrows clickable from `min` items on |
| `mask` | `false` | `true` or `{ size }` to fade the overflowing edges with `mask-image` |
| `behavior` | `'smooth'` | Scroll behavior of the arrows |
| `labels` | English | `aria-label` per edge |

## What you get

| Field | |
|---|---|
| `state` | `{ top, right, bottom, left, inset }` |
| `getContainerProps(props?)` | `ref`, `data-overflow-<edge>` and the mask style, merged with yours |
| `getAnchorProps(edge)` | A zero-size sticky anchor, offset by the sticky inset; place `top`/`left` before the content and `bottom`/`right` after it |
| `getArrowProps(edge)` | A button that jumps to the edge, or `aria-hidden` props when not jumpable |
| `scrollToEdge(edge)`, `check()` | Imperative helpers |
| `mask` | The mask style alone |

The container measures on scroll and on size changes of itself, its children and its sticky elements,
batched in one animation frame. `scroll-edges` (without `/react`) exposes the same engine without React:
`createScrollEdges(options)` with `attach`, `subscribe`, `getState`, `scrollToEdge`, and `edgeMask(state)`.

## License

AGPL-3.0-only.
