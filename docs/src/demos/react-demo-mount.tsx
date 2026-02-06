import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactDemo } from './react-demo';

export function setupReactDemo() {
	const el = document.getElementById('react-demo-root');
	if (!el) return;

	createRoot(el).render(<ReactDemo />);
}
