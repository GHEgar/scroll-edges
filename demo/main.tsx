import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MaskList, StickyList, YearRow } from './Lists';

function App() {
    return (
        <main className="page">
            <h1>
                <code>scroll-edges</code>
                {' — which edges hide content'}
            </h1>
            <div className="row">
                <StickyList />
                <MaskList />
            </div>
            <YearRow />
        </main>
    );
}

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
