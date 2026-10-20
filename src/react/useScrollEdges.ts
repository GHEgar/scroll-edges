import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { createScrollEdges, edgeMask, edgeShadow } from '../core/index.js';
import type { Edge, EdgeMap, EdgeState, MaskOptions, ScrollEdgesOptions, ShadowOptions } from '../core/index.js';

export type Jump = boolean | { items: number; min: number };

export interface UseScrollEdgesOptions extends ScrollEdgesOptions {
    jump?: Jump | undefined;
    mask?: boolean | MaskOptions | undefined;
    shadow?: boolean | ShadowOptions | undefined;
    behavior?: ScrollBehavior | undefined;
    labels?: Partial<EdgeMap<string>> | undefined;
}

type EdgeFlag = '' | undefined;

export interface ContainerProps {
    ref: (element: HTMLElement | null) => void;
    style: CSSProperties;
    'data-overflow-top': EdgeFlag;
    'data-overflow-right': EdgeFlag;
    'data-overflow-bottom': EdgeFlag;
    'data-overflow-left': EdgeFlag;
}

export interface AnchorProps {
    style: CSSProperties;
    'data-edge': Edge;
}

export interface ShadowProps {
    style: CSSProperties;
    'data-edge': Edge;
    'data-visible': EdgeFlag;
    'aria-hidden': true;
}

export interface ArrowProps {
    'data-edge': Edge;
    'data-jumpable'?: '';
    'aria-hidden'?: true;
    'aria-label'?: string;
    type?: 'button';
    onClick?: () => void;
    style?: CSSProperties;
}

const LABELS: EdgeMap<string> = {
    top: 'Scroll to top',
    right: 'Scroll to right',
    bottom: 'Scroll to bottom',
    left: 'Scroll to left',
};

const flag = (value: boolean): EdgeFlag => (value ? '' : undefined);

const isJumpable = (jump: Jump): boolean => (typeof jump === 'boolean' ? jump : jump.items >= jump.min);

const anchorStyle = (edge: Edge, inset: number): CSSProperties => {
    const base: CSSProperties = { position: 'sticky', pointerEvents: 'none', [edge]: inset };
    return edge === 'top' || edge === 'bottom'
        ? { ...base, left: 0, right: 0, height: 0 }
        : { ...base, top: 0, bottom: 0, width: 0 };
};

export function useScrollEdges(options: UseScrollEdgesOptions = {}) {
    const { axis, threshold, sticky, jump = false, mask = false, shadow = false, behavior = 'smooth', labels } = options;
    const [edges] = useState(() => createScrollEdges({ axis, threshold, sticky }));

    useEffect(() => {
        edges.setOptions({ axis, threshold, sticky });
    }, [edges, axis, threshold, sticky]);

    const state: EdgeState = useSyncExternalStore(edges.subscribe, edges.getState, edges.getState);
    const ref = useCallback((element: HTMLElement | null) => edges.attach(element), [edges]);
    const scrollToEdge = useCallback((edge: Edge) => edges.scrollToEdge(edge, behavior), [edges, behavior]);

    const maskSize = typeof mask === 'object' ? mask.size : undefined;
    const maskStyle = useMemo<CSSProperties>(
        () => (mask ? edgeMask(state, maskSize ? { size: maskSize } : {}) : {}),
        [mask, maskSize, state],
    );

    const getContainerProps = <P extends HTMLAttributes<HTMLElement>>(props?: P): P & ContainerProps => ({
        ...(props as P),
        ref,
        style: { ...maskStyle, ...props?.style },
        'data-overflow-top': flag(state.top),
        'data-overflow-right': flag(state.right),
        'data-overflow-bottom': flag(state.bottom),
        'data-overflow-left': flag(state.left),
    });

    const getAnchorProps = (edge: Edge): AnchorProps => ({
        style: anchorStyle(edge, state.inset[edge]),
        'data-edge': edge,
    });

    const shadowOptions = typeof shadow === 'object' ? shadow : {};
    const getShadowProps = (edge: Edge): ShadowProps => {
        const visible = Boolean(shadow) && state[edge];
        return {
            style: edgeShadow(edge, visible, shadowOptions),
            'data-edge': edge,
            'data-visible': flag(visible),
            'aria-hidden': true,
        };
    };

    const jumpable = isJumpable(jump);
    const getArrowProps = (edge: Edge): ArrowProps => {
        if (!jumpable) return { 'data-edge': edge, 'aria-hidden': true };
        return {
            'data-edge': edge,
            'data-jumpable': '',
            'aria-label': labels?.[edge] ?? LABELS[edge],
            type: 'button',
            onClick: () => scrollToEdge(edge),
            style: { pointerEvents: 'auto' },
        };
    };

    return {
        ref,
        state,
        jumpable,
        mask: maskStyle,
        check: edges.check,
        scrollToEdge,
        getContainerProps,
        getAnchorProps,
        getArrowProps,
        getShadowProps,
    };
}
