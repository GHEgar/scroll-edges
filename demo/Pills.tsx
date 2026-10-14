import type { Edge, EdgeState } from 'scroll-edges/react';

interface PillsProps {
    id: string;
    state: EdgeState;
    edges: Edge[];
    inset?: Edge;
}

export function Pills({ id, state, edges, inset }: PillsProps) {
    return (
        <div className="pills" data-testid={`${id}-pills`}>
            {edges.map((edge) => (
                <span key={edge} className={state[edge] ? 'pill on' : 'pill'} data-testid={`${id}-pill-${edge}`}>
                    {`${edge}: ${String(state[edge])}`}
                </span>
            ))}
            {inset && (
                <span className={state.inset[inset] ? 'pill on' : 'pill'} data-testid={`${id}-pill-inset`}>
                    {`inset.${inset}: ${Math.round(state.inset[inset])}`}
                </span>
            )}
        </div>
    );
}
