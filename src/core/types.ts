export type Edge = 'top' | 'right' | 'bottom' | 'left';

export type Axis = 'x' | 'y' | 'both';

export type EdgeMap<T> = Record<Edge, T>;

export interface EdgeState extends EdgeMap<boolean> {
    readonly inset: Readonly<EdgeMap<number>>;
}

export interface ScrollEdgesOptions {
    axis?: Axis | undefined;
    threshold?: number | undefined;
    sticky?: string | false | undefined;
}

export interface ResolvedOptions {
    axis: Axis;
    threshold: number;
    sticky: string | false;
}

export interface ScrollEdges {
    attach(element: HTMLElement | null): void;
    getState(): EdgeState;
    subscribe(listener: () => void): () => void;
    setOptions(options: ScrollEdgesOptions): void;
    check(): void;
    scrollToEdge(edge: Edge, behavior?: ScrollBehavior): void;
}

export interface MaskOptions {
    size?: string;
}

export interface MaskStyle {
    maskImage?: string;
    WebkitMaskImage?: string;
    maskComposite?: 'intersect';
    WebkitMaskComposite?: 'source-in';
}

export interface ShadowOptions {
    size?: string;
    color?: string;
}

export interface ShadowStyle {
    position: 'absolute';
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    width?: string;
    height?: string;
    background?: string;
    opacity?: number;
    pointerEvents?: 'none';
}
