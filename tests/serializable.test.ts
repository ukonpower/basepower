import { describe, it, expect } from 'vitest';
import { Serializable } from '../src/Serializable';

function createSimple() {
  const s = new Serializable();
  let value = 1;
  s.field('value', () => value, (v: number) => { value = v; });
  return { s, get value() { return value; }, setValue(v: number) { value = v; } };
}

describe('Serializable', () => {
  it('sets and gets field values', () => {
    const { s } = createSimple();
    expect(s.getField('value')).toBe(1);
    s.setField('value', 5);
    expect(s.getField('value')).toBe(5);
  });

  it('serialize respects noExport flag for readonly fields', () => {
    const { s } = createSimple();
    let hidden = 3;
    s.field('hidden', () => hidden); // no setter -> readOnly & noExport

    const view = s.serialize();
    expect(view).toEqual({ value: 1, hidden: 3 });

    const exported = s.serialize({ mode: 'export' });
    expect(exported).toEqual({ value: 1 });
  });

  it('serializeToDirectory creates nested structure', () => {
    const s = new Serializable();
    const rootDir = s.fieldDir('foo');
    let num = 2;
    rootDir.field('bar', () => num, (v: number) => { num = v; });

    const dir = s.serializeToDirectory();
    expect(dir).toEqual({
      type: 'folder',
      childs: {
        foo: {
          type: 'folder',
          childs: {
            bar: {
              type: 'value',
              value: 2,
              opt: {},
            },
          },
          opt: { isFolder: true, noExport: true, readOnly: true },
        },
      },
      opt: {},
    });
  });

  it('has a uuid', () => {
    const s = new Serializable();
    expect(s.uuid).toBeDefined();
    expect(typeof s.uuid).toBe('string');
    expect(s.uuid.length).toBeGreaterThan(0);
  });

  it('each instance has a unique uuid', () => {
    const a = new Serializable();
    const b = new Serializable();
    expect(a.uuid).not.toBe(b.uuid);
  });
});
