import { describe, expect, it } from 'vitest';
import { EMPTY_STATE, readState } from '../../src/core/measure.js';
import type { ResolvedOptions } from '../../src/core/types.js';
import { setMetrics, setRect, VERTICAL } from '../metrics.js';

const Y: ResolvedOptions = { axis: 'y', threshold: 1, sticky: '[data-sticky]' };

const container = () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    return element;
};

describe('readState', () => {
    it('marks only the bottom edge at the start', () => {
        const element = container();
        setMetrics(element, { ...VERTICAL, scrollTop: 0 });
        const state = readState(element, Y);
        expect([state.top, state.bottom, state.left, state.right]).toEqual([false, true, false, false]);
    });

    it('marks both vertical edges in the middle and only top at the end', () => {
        const element = container();
        setMetrics(element, { ...VERTICAL, scrollTop: 200 });
        expect([readState(element, Y).top, readState(element, Y).bottom]).toEqual([true, true]);
        setMetrics(element, { scrollTop: 400 });
        expect([readState(element, Y).top, readState(element, Y).bottom]).toEqual([true, false]);
    });

    it('respects the threshold', () => {
        const element = container();
        setMetrics(element, { ...VERTICAL, scrollTop: 3 });
        expect(readState(element, { ...Y, threshold: 5 }).top).toBe(false);
    });

    it('ignores the other axis', () => {
        const element = container();
        setMetrics(element, { scrollHeight: 500, clientHeight: 100, scrollWidth: 500, clientWidth: 100, scrollTop: 0, scrollLeft: 0 });
        expect(readState(element, Y).right).toBe(false);
        expect(readState(element, { ...Y, axis: 'x' }).right).toBe(true);
        expect(readState(element, { ...Y, axis: 'x' }).bottom).toBe(false);
        const both = readState(element, { ...Y, axis: 'both' });
        expect([both.bottom, both.right]).toEqual([true, true]);
    });

    it('reads negative scrollLeft in rtl', () => {
        const element = container();
        element.style.direction = 'rtl';
        setMetrics(element, { scrollWidth: 500, clientWidth: 100, scrollLeft: 0 });
        const start = readState(element, { ...Y, axis: 'x' });
        expect([start.left, start.right]).toEqual([true, false]);
        setMetrics(element, { scrollLeft: -400 });
        const end = readState(element, { ...Y, axis: 'x' });
        expect([end.left, end.right]).toEqual([false, true]);
    });

    it('measures a stuck sticky element as inset', () => {
        const element = container();
        const header = document.createElement('div');
        header.setAttribute('data-sticky', '');
        element.appendChild(header);
        setMetrics(element, { ...VERTICAL, scrollTop: 50 });
        setRect(element, { top: 10, left: 0, width: 100, height: 100 });
        setRect(header, { top: 10, left: 0, width: 100, height: 24.4 });
        expect(readState(element, Y).inset).toEqual({ top: 24, right: 0, bottom: 0, left: 0 });
        expect(readState(element, { ...Y, sticky: false }).inset.top).toBe(0);
    });

    it('ignores a sticky element that is not stuck', () => {
        const element = container();
        const header = document.createElement('div');
        header.setAttribute('data-sticky', '');
        element.appendChild(header);
        setMetrics(element, { ...VERTICAL, scrollTop: 50 });
        setRect(element, { top: 10, left: 0, width: 100, height: 100 });
        setRect(header, { top: 60, left: 0, width: 100, height: 24 });
        expect(readState(element, Y).inset.top).toBe(0);
    });

    it('starts empty', () => {
        expect(EMPTY_STATE.top || EMPTY_STATE.bottom).toBe(false);
    });
});
