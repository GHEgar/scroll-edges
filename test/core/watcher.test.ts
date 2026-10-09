import { describe, expect, it, vi } from 'vitest';
import { createScrollEdges, EMPTY_STATE } from '../../src/core/index.js';
import { setMetrics, VERTICAL } from '../metrics.js';

const mounted = () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    setMetrics(element, { ...VERTICAL, scrollTop: 0 });
    return element;
};

describe('createScrollEdges', () => {
    it('publishes the state after check and notifies once per change', () => {
        const edges = createScrollEdges();
        const listener = vi.fn();
        edges.subscribe(listener);
        edges.attach(mounted());
        edges.check();
        expect(edges.getState().bottom).toBe(true);
        expect(listener).toHaveBeenCalledTimes(1);
        edges.check();
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('keeps the same reference while nothing changes', () => {
        const edges = createScrollEdges();
        edges.attach(mounted());
        edges.check();
        const first = edges.getState();
        edges.check();
        expect(edges.getState()).toBe(first);
    });

    it('measures on the next frame after a scroll event', async () => {
        const edges = createScrollEdges();
        const element = mounted();
        edges.attach(element);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        setMetrics(element, { scrollTop: 200 });
        element.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        expect(edges.getState().top).toBe(true);
    });

    it('resets on detach and stops listening', () => {
        const edges = createScrollEdges();
        const element = mounted();
        edges.attach(element);
        edges.check();
        edges.attach(null);
        expect(edges.getState()).toBe(EMPTY_STATE);
        const unsubscribe = edges.subscribe(vi.fn());
        unsubscribe();
    });

    it('reapplies options', () => {
        const edges = createScrollEdges({ axis: 'y' });
        const element = mounted();
        setMetrics(element, { scrollWidth: 400 });
        edges.attach(element);
        edges.check();
        expect(edges.getState().right).toBe(false);
        edges.setOptions({ axis: 'both' });
        edges.check();
        expect(edges.getState().right).toBe(true);
    });

    it('scrolls to each edge', () => {
        const edges = createScrollEdges();
        const element = mounted();
        setMetrics(element, { scrollWidth: 400 });
        element.scrollTo = vi.fn() as typeof element.scrollTo;
        edges.attach(element);
        edges.scrollToEdge('bottom');
        edges.scrollToEdge('top', 'auto');
        edges.scrollToEdge('right');
        expect(element.scrollTo).toHaveBeenNthCalledWith(1, { top: 500, behavior: 'smooth' });
        expect(element.scrollTo).toHaveBeenNthCalledWith(2, { top: 0, behavior: 'auto' });
        expect(element.scrollTo).toHaveBeenNthCalledWith(3, { left: 400, behavior: 'smooth' });
    });
});
