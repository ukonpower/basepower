import { EventEmitter } from 'basepower';

export function setupEventEmitterDemo(log: (msg: string) => void) {
  const emitter = new EventEmitter();

  document.getElementById('btn-emitter-on')!.addEventListener('click', () => {
    emitter.on('greet', (name: string) => {
      log(`[EventEmitter] greet listener called: Hello, ${name || 'World'}!`);
    });
    log('[EventEmitter] Registered on("greet") listener');
  });

  document.getElementById('btn-emitter-emit')!.addEventListener('click', () => {
    emitter.emit('greet', ['basepower']);
    log('[EventEmitter] emit("greet", ["basepower"])');
  });

  document.getElementById('btn-emitter-once')!.addEventListener('click', () => {
    emitter.once('greet', () => {
      log('[EventEmitter] once("greet") fired (will not fire again)');
    });
    log('[EventEmitter] Registered once("greet") listener');
  });

  document.getElementById('btn-emitter-off')!.addEventListener('click', () => {
    emitter.off('greet');
    log('[EventEmitter] off("greet") — all listeners removed');
  });
}
