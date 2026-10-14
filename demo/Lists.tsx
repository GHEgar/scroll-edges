import { useScrollEdges } from 'scroll-edges/react';
import { Pills } from './Pills';

const LAYERS = ['Roads', 'Rivers', 'Parcels', 'Buildings', 'Contours', 'Schools', 'Parks', 'Rail', 'Wells', 'Bridges', 'Hospitals', 'Lakes', 'Zoning', 'Census', 'Soils', 'Faults'];
const YEARS = Array.from({ length: 14 }, (_, index) => 2011 + index);

export function StickyList() {
    const { state, getContainerProps, getAnchorProps, getArrowProps } = useScrollEdges({ jump: true });
    return (
        <section className="panel">
            <h2>Sticky header · jump arrows</h2>
            <div {...getContainerProps({ className: 'box v', 'data-testid': 'sticky' })}>
                <div className="header" data-sticky="" data-testid="sticky-header">Layers</div>
                <div {...getAnchorProps('top')} className="anchor">
                    {state.top && <button {...getArrowProps('top')} className="arrow" data-testid="sticky-arrow-top">↑</button>}
                </div>
                {LAYERS.map((layer) => <div key={layer} className="item">{layer}</div>)}
                <div {...getAnchorProps('bottom')} className="anchor">
                    {state.bottom && <button {...getArrowProps('bottom')} className="arrow" data-testid="sticky-arrow-bottom">↓</button>}
                </div>
            </div>
            <Pills id="sticky" state={state} edges={['top', 'bottom']} inset="top" />
        </section>
    );
}

export function MaskList() {
    const { state, getContainerProps, getAnchorProps, getArrowProps } = useScrollEdges({ jump: true, mask: { size: '12%' }, sticky: false });
    return (
        <section className="panel">
            <h2>Edge mask · jump arrows</h2>
            <div {...getContainerProps({ className: 'box v', 'data-testid': 'mask' })}>
                <div {...getAnchorProps('top')} className="anchor">
                    {state.top && <button {...getArrowProps('top')} className="arrow" data-testid="mask-arrow-top">↑</button>}
                </div>
                {LAYERS.map((layer) => <div key={layer} className="item">{layer}</div>)}
                <div {...getAnchorProps('bottom')} className="anchor">
                    {state.bottom && <button {...getArrowProps('bottom')} className="arrow" data-testid="mask-arrow-bottom">↓</button>}
                </div>
            </div>
            <Pills id="mask" state={state} edges={['top', 'bottom']} />
        </section>
    );
}

export function YearRow() {
    const { state, getContainerProps, getAnchorProps, getArrowProps } = useScrollEdges({ axis: 'x', jump: true, sticky: false });
    return (
        <section className="panel wide">
            <h2>axis: &apos;x&apos; · jump arrows</h2>
            <div {...getContainerProps({ className: 'box h', 'data-testid': 'row' })}>
                <div {...getAnchorProps('left')} className="anchor">
                    {state.left && <button {...getArrowProps('left')} className="arrow" data-testid="row-arrow-left">←</button>}
                </div>
                {YEARS.map((year) => <div key={year} className="chip">{year}</div>)}
                <div {...getAnchorProps('right')} className="anchor">
                    {state.right && <button {...getArrowProps('right')} className="arrow" data-testid="row-arrow-right">→</button>}
                </div>
            </div>
            <Pills id="row" state={state} edges={['left', 'right']} />
        </section>
    );
}
