import { setupEventEmitterDemo } from './event-emitter-demo';
import { setupSerializableDemo } from './serializable-demo';

const logEl = document.getElementById('log')!;

function log(msg: string) {
  const time = new Date().toLocaleTimeString();
  logEl.textContent += `[${time}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

document.getElementById('btn-clear')!.addEventListener('click', () => {
  logEl.textContent = '';
});

setupEventEmitterDemo(log);
setupSerializableDemo(log);

log('Ready.');
