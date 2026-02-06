import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.min.css';

import { setupEventEmitterDemo } from './demos/event-emitter-demo';
import { setupSerializableDemo } from './demos/serializable-demo';
import { setupReactDemo } from './demos/react-demo-mount';
import { setupLLMCopy } from './llm-copy';

// highlight.js setup
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
hljs.highlightAll();

// Demo log helpers
function createLogger(logElId: string) {
  const logEl = document.getElementById(logElId)!;
  return (msg: string) => {
    const time = new Date().toLocaleTimeString();
    logEl.textContent += `[${time}] ${msg}\n`;
    logEl.scrollTop = logEl.scrollHeight;
  };
}

// EventEmitter demo
setupEventEmitterDemo(createLogger('log-emitter'));

// Serializable demo
setupSerializableDemo(createLogger('log-serializable'));

// Clear buttons
document.getElementById('btn-clear-emitter')?.addEventListener('click', () => {
  document.getElementById('log-emitter')!.textContent = '';
});
document.getElementById('btn-clear-serializable')?.addEventListener('click', () => {
  document.getElementById('log-serializable')!.textContent = '';
});

// React demo
setupReactDemo();

// Copy for LLM
setupLLMCopy();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!);
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});
