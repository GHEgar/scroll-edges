export interface Metrics {
    scrollTop?: number;
    scrollLeft?: number;
    scrollHeight?: number;
    scrollWidth?: number;
    clientHeight?: number;
    clientWidth?: number;
}

export function setMetrics(element: HTMLElement, metrics: Metrics): void {
    Object.entries(metrics).forEach(([key, value]) => {
        Object.defineProperty(element, key, { configurable: true, writable: true, value });
    });
}

export function setRect(element: Element, rect: { top: number; left: number; width: number; height: number }): void {
    const { top, left, width, height } = rect;
    const box = { top, left, width, height, right: left + width, bottom: top + height, x: left, y: top };
    element.getBoundingClientRect = () => ({ ...box, toJSON: () => box }) as DOMRect;
}

export const VERTICAL: Metrics = { scrollHeight: 500, clientHeight: 100, scrollWidth: 100, clientWidth: 100 };
