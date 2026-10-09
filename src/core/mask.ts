import type { EdgeMap, MaskOptions, MaskStyle } from './types.js';

const gradient = (start: boolean, end: boolean, direction: string, size: string): string | null => {
    if (!start && !end) return null;
    const head = start ? `transparent 0%, black ${size}` : 'black 0%';
    const tail = end ? `black calc(100% - ${size}), transparent 100%` : 'black 100%';
    return `linear-gradient(${direction}, ${head}, ${tail})`;
};

export function edgeMask(state: EdgeMap<boolean>, { size = '10%' }: MaskOptions = {}): MaskStyle {
    const layers = [
        gradient(state.top, state.bottom, 'to bottom', size),
        gradient(state.left, state.right, 'to right', size),
    ].filter((layer): layer is string => layer !== null);
    if (layers.length === 0) return {};
    const image = layers.join(', ');
    const style: MaskStyle = { maskImage: image, WebkitMaskImage: image };
    if (layers.length > 1) {
        style.maskComposite = 'intersect';
        style.WebkitMaskComposite = 'source-in';
    }
    return style;
}
