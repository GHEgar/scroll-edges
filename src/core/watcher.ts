import { EMPTY_STATE, isRtl, readState, sameState } from './measure.js';
import type { Edge, ResolvedOptions, ScrollEdges, ScrollEdgesOptions } from './types.js';

const DEFAULTS: ResolvedOptions = { axis: 'y', threshold: 1, sticky: '[data-sticky]' };

const resolve = (options: ScrollEdgesOptions): ResolvedOptions => ({
    axis: options.axis ?? DEFAULTS.axis,
    threshold: options.threshold ?? DEFAULTS.threshold,
    sticky: options.sticky ?? DEFAULTS.sticky,
});

export function createScrollEdges(options: ScrollEdgesOptions = {}): ScrollEdges {
    let config = resolve(options);
    let element: HTMLElement | null = null;
    let state = EMPTY_STATE;
    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const observed = new Set<Element>();
    const listeners = new Set<() => void>();

    const publish = (next: typeof state) => {
        if (sameState(state, next)) return;
        state = next;
        listeners.forEach((listener) => listener());
    };

    const measure = () => {
        frame = 0;
        if (element) publish(readState(element, config));
    };

    const schedule = () => {
        if (frame || !element) return;
        frame = requestAnimationFrame(measure);
    };

    const observeTargets = () => {
        if (!resizeObserver || !element) return;
        const targets = new Set<Element>([element, ...Array.from(element.children)]);
        if (config.sticky) element.querySelectorAll(config.sticky).forEach((target) => targets.add(target));
        observed.forEach((target) => {
            if (targets.has(target)) return;
            resizeObserver?.unobserve(target);
            observed.delete(target);
        });
        targets.forEach((target) => {
            if (observed.has(target)) return;
            resizeObserver?.observe(target);
            observed.add(target);
        });
    };

    const onMutation = () => {
        observeTargets();
        schedule();
    };

    const disconnect = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        resizeObserver?.disconnect();
        mutationObserver?.disconnect();
        resizeObserver = null;
        mutationObserver = null;
        observed.clear();
        element?.removeEventListener('scroll', schedule);
        element = null;
    };

    const connect = (target: HTMLElement) => {
        element = target;
        if (typeof ResizeObserver !== 'undefined') resizeObserver = new ResizeObserver(schedule);
        if (typeof MutationObserver !== 'undefined') {
            mutationObserver = new MutationObserver(onMutation);
            mutationObserver.observe(target, { childList: true, subtree: true });
        }
        observeTargets();
        target.addEventListener('scroll', schedule, { passive: true });
        schedule();
    };

    return {
        attach(target) {
            if (target === element) return;
            disconnect();
            if (target) connect(target);
            else publish(EMPTY_STATE);
        },
        getState: () => state,
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        setOptions(next) {
            const resolved = resolve(next);
            if (resolved.axis === config.axis && resolved.threshold === config.threshold && resolved.sticky === config.sticky) return;
            config = resolved;
            observeTargets();
            schedule();
        },
        check() {
            if (frame) cancelAnimationFrame(frame);
            measure();
        },
        scrollToEdge(edge: Edge, behavior: ScrollBehavior = 'smooth') {
            if (!element) return;
            const rtl = edge === 'left' || edge === 'right' ? isRtl(element) : false;
            const far = edge === 'top' || edge === 'bottom' ? element.scrollHeight : element.scrollWidth;
            const positions: Record<Edge, ScrollToOptions> = {
                top: { top: 0 },
                bottom: { top: far },
                left: { left: rtl ? -far : 0 },
                right: { left: rtl ? 0 : far },
            };
            element.scrollTo({ ...positions[edge], behavior });
        },
    };
}
