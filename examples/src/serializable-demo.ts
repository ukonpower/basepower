import { Serializable } from 'basepower';

export function setupSerializableDemo(log: (msg: string) => void) {
  const obj = new Serializable();
  let name = 'Player1';
  let score = 100;

  obj.field('name', () => name);
  obj.field('score', () => score, (v: number) => { score = v; });

  const statsDir = obj.fieldDir('stats');
  let hp = 50;
  statsDir.field('hp', () => hp, (v: number) => { hp = v; });

  obj.on('fields/update', (path: string) => {
    log(`[Serializable] fields/update: ${path}`);
  });

  document.getElementById('btn-serialize')!.addEventListener('click', () => {
    const data = obj.serialize();
    log('[Serializable] serialize() => ' + JSON.stringify(data, null, 2));
  });

  document.getElementById('btn-set')!.addEventListener('click', () => {
    const v = Math.floor(Math.random() * 1000);
    obj.setField('score', v);
    log(`[Serializable] setField("score", ${v})`);
  });

  document.getElementById('btn-dir')!.addEventListener('click', () => {
    const schema = obj.getSchema();
    log('[Serializable] getSchema() => ' + JSON.stringify(schema, null, 2));
  });

  document.getElementById('btn-deserialize')!.addEventListener('click', () => {
    obj.deserialize({ score: 999 });
    log('[Serializable] deserialize({score: 999}) — score is now ' + obj.getField('score'));
  });
}
