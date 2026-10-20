import type { Edge, ShadowOptions, ShadowStyle } from './types.js';

const DIRECTION: Record<Edge, string> = {
    top: 'to bottom',
    right: 'to left',
    bottom: 'to top',
    left: 'to right',
};

export function edgeShadow(edge: Edge, visible: boolean, { size = '16px', color = 'rgba(0, 0, 0, 0.18)' }: ShadowOptions = {}): ShadowStyle {
    const vertical = edge === 'top' || edge === 'bottom';
    const placement: ShadowStyle = vertical
        ? { position: 'absolute', [edge]: 0, left: 0, right: 0, height: size }
        : { position: 'absolute', [edge]: 0, top: 0, bottom: 0, width: size };
    return {
        ...placement,
        background: `linear-gradient(${DIRECTION[edge]}, ${color}, transparent)`,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
    };
}
