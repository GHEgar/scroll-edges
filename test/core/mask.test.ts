import { describe, expect, it } from 'vitest';
import { edgeMask } from '../../src/core/index.js';

const edges = (top: boolean, right: boolean, bottom: boolean, left: boolean) => ({ top, right, bottom, left });

describe('edgeMask', () => {
    it('is empty without overflow', () => {
        expect(edgeMask(edges(false, false, false, false))).toEqual({});
    });

    it('fades only the edges that hide content', () => {
        expect(edgeMask(edges(false, false, true, false)).maskImage)
            .toBe('linear-gradient(to bottom, black 0%, black calc(100% - 10%), transparent 100%)');
        expect(edgeMask(edges(true, false, true, false), { size: '2rem' }).maskImage)
            .toBe('linear-gradient(to bottom, transparent 0%, black 2rem, black calc(100% - 2rem), transparent 100%)');
    });

    it('intersects both axes', () => {
        const style = edgeMask(edges(true, true, false, false));
        expect(style.maskComposite).toBe('intersect');
        expect(style.WebkitMaskImage).toBe(style.maskImage);
        expect(style.maskImage?.split('linear-gradient').length).toBe(3);
    });
});
