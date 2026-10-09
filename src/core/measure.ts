import type { Edge, EdgeMap, EdgeState, ResolvedOptions } from './types.js';

export const EDGES: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

const NEAR = 2;

const emptyMap = <T>(value: T): EdgeMap<T> => ({ top: value, right: value, bottom: value, left: value });

export const EMPTY_STATE: EdgeState = Object.freeze({
    ...emptyMap(false),
    inset: Object.freeze(emptyMap(0)),
});

export const isRtl = (element: HTMLElement): boolean => getComputedStyle(element).direction === 'rtl';

export function readOverflow(element: HTMLElement, { axis, threshold }: ResolvedOptions): EdgeMap<boolean> {
    const overflow = emptyMap(false);
    if (axis !== 'x') {
        const { scrollTop, scrollHeight, clientHeight } = element;
        overflow.top = scrollTop > threshold;
        overflow.bottom = scrollTop + clientHeight < scrollHeight - threshold;
    }
    if (axis !== 'y') {
        const { scrollLeft, scrollWidth, clientWidth } = element;
        const max = scrollWidth - clientWidth;
        const offset = isRtl(element) ? max + scrollLeft : scrollLeft;
        overflow.left = offset > threshold;
        overflow.right = offset < max - threshold;
    }
    return overflow;
}

export function readInsets(element: HTMLElement, sticky: string | false, overflow: EdgeMap<boolean>): EdgeMap<number> {
    const inset = emptyMap(0);
    if (!sticky || !EDGES.some((edge) => overflow[edge])) return inset;
    const targets = element.querySelectorAll<HTMLElement>(sticky);
    if (targets.length === 0) return inset;

    const box = element.getBoundingClientRect();
    const top = box.top + element.clientTop;
    const left = box.left + element.clientLeft;
    const bottom = top + element.clientHeight;
    const right = left + element.clientWidth;
    const near = (a: number, b: number) => Math.abs(a - b) < NEAR;

    targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const height = Math.round(rect.height);
        const width = Math.round(rect.width);
        if (overflow.top && near(rect.top, top)) inset.top = Math.max(inset.top, height);
        if (overflow.bottom && near(rect.bottom, bottom)) inset.bottom = Math.max(inset.bottom, height);
        if (overflow.left && near(rect.left, left)) inset.left = Math.max(inset.left, width);
        if (overflow.right && near(rect.right, right)) inset.right = Math.max(inset.right, width);
    });
    return inset;
}

export function readState(element: HTMLElement, options: ResolvedOptions): EdgeState {
    const overflow = readOverflow(element, options);
    return { ...overflow, inset: readInsets(element, options.sticky, overflow) };
}

export const sameState = (a: EdgeState, b: EdgeState): boolean =>
    EDGES.every((edge) => a[edge] === b[edge] && a.inset[edge] === b.inset[edge]);
