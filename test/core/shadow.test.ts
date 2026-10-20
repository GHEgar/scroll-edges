import { describe, expect, it } from 'vitest';
import { edgeShadow } from '../../src/core/index.js';

describe('edgeShadow', () => {
    it('pins a horizontal band to the top edge and fades downwards', () => {
        expect(edgeShadow('top', true)).toEqual({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '16px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.18), transparent)',
            opacity: 1,
            pointerEvents: 'none',
        });
    });

    it('grows the bottom band upwards and hides it without overflow', () => {
        const style = edgeShadow('bottom', false, { size: '8px', color: 'red' });
        expect(style.bottom).toBe(0);
        expect(style.top).toBeUndefined();
        expect(style.height).toBe('8px');
        expect(style.background).toBe('linear-gradient(to top, red, transparent)');
        expect(style.opacity).toBe(0);
    });

    it('uses vertical bands for the side edges', () => {
        const right = edgeShadow('right', true, { size: '1rem' });
        expect([right.right, right.top, right.bottom, right.width, right.height]).toEqual([0, 0, 0, '1rem', undefined]);
        expect(right.background).toContain('to left');
        expect(edgeShadow('left', true).background).toContain('to right');
    });
});
