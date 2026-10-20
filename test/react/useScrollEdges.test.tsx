import { useEffect } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollEdges } from '../../src/react/index.js';
import type { UseScrollEdgesOptions } from '../../src/react/index.js';
import { setMetrics, VERTICAL } from '../metrics.js';

let check: () => void = () => undefined;

afterEach(cleanup);

function List(options: UseScrollEdgesOptions) {
    const edges = useScrollEdges(options);
    useEffect(() => {
        check = edges.check;
    }, [edges.check]);
    return (
        <div {...edges.getContainerProps({ className: 'list', 'aria-label': 'list' })}>
            <div {...edges.getAnchorProps('top')}>
                <span {...edges.getShadowProps('top')} data-testid="shadow-top" />
                {edges.state.top && <button {...edges.getArrowProps('top')}>up</button>}
            </div>
            <p>item</p>
            <div {...edges.getAnchorProps('bottom')}>
                <span {...edges.getShadowProps('bottom')} data-testid="shadow-bottom" />
                {edges.state.bottom && <button {...edges.getArrowProps('bottom')}>down</button>}
            </div>
        </div>
    );
}

const prepare = (scrollTop: number) => {
    const list = screen.getByLabelText('list');
    setMetrics(list, { ...VERTICAL, scrollTop });
    list.scrollTo = vi.fn() as typeof list.scrollTo;
    act(() => check());
    return list;
};

describe('useScrollEdges', () => {
    it('flags the container and renders the edge arrows', () => {
        render(<List />);
        const list = prepare(200);
        expect(list.className).toBe('list');
        expect(list.hasAttribute('data-overflow-top')).toBe(true);
        expect(list.hasAttribute('data-overflow-bottom')).toBe(true);
        expect(list.hasAttribute('data-overflow-left')).toBe(false);
        expect(screen.getByText('up').getAttribute('aria-hidden')).toBe('true');
    });

    it('positions the anchors with the sticky inset', () => {
        render(<List />);
        prepare(0);
        const anchor = screen.getByText('down').parentElement as HTMLElement;
        expect(anchor.style.position).toBe('sticky');
        expect(anchor.style.bottom).toBe('0px');
        expect(anchor.style.pointerEvents).toBe('none');
    });

    it('jumps to the edge when the threshold is reached', () => {
        render(<List jump={{ items: 5, min: 3 }} labels={{ bottom: 'Ir al final' }} behavior="auto" />);
        const list = prepare(0);
        const arrow = screen.getByLabelText('Ir al final');
        expect(arrow.hasAttribute('data-jumpable')).toBe(true);
        fireEvent.click(arrow);
        expect(list.scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'auto' });
    });

    it('keeps the arrows passive below the threshold', () => {
        render(<List jump={{ items: 2, min: 3 }} />);
        prepare(0);
        expect(screen.getByText('down').hasAttribute('data-jumpable')).toBe(false);
    });

    it('applies the mask to the container style', () => {
        render(<List mask={{ size: '20%' }} />);
        const list = prepare(0);
        expect(list.getAttribute('style')).toContain('mask-image');
        expect(list.getAttribute('style')).toContain('20%');
    });

    it('shows the shadows of the overflowing edges without masking the container', () => {
        render(<List shadow={{ size: '12px' }} />);
        const list = prepare(0);
        const top = screen.getByTestId('shadow-top');
        const bottom = screen.getByTestId('shadow-bottom');
        expect(list.getAttribute('style') ?? '').not.toContain('mask-image');
        expect(top.hasAttribute('data-visible')).toBe(false);
        expect(top.style.opacity).toBe('0');
        expect(bottom.hasAttribute('data-visible')).toBe(true);
        expect(bottom.style.opacity).toBe('1');
        expect(bottom.style.height).toBe('12px');
        expect(bottom.getAttribute('aria-hidden')).toBe('true');
    });

    it('keeps the shadows hidden while the option is off', () => {
        render(<List />);
        prepare(200);
        expect(screen.getByTestId('shadow-bottom').hasAttribute('data-visible')).toBe(false);
        expect(screen.getByTestId('shadow-top').style.opacity).toBe('0');
    });
});
