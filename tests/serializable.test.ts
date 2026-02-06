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

  it('serialize excludes fields with export: false', () => {
    const { s } = createSimple();
    let readOnlyVal = 3;
    s.field('readOnlyVal', () => readOnlyVal); // no setter -> readOnly only (still exported)

    // No-setter field IS included in serialize
    const json = s.serialize();
    expect(json).toEqual({ value: 1, readOnlyVal: 3 });

    // Add an explicitly non-exported field
    let internal = 99;
    s.field('internal', () => internal, (v: number) => { internal = v; }, { export: false });
    const json2 = s.serialize();
    expect(json2).toEqual({ value: 1, readOnlyVal: 3 });
    // 'internal' is excluded because export: false
  });

  it('getSchema creates nested structure', () => {
    const s = new Serializable();
    const rootDir = s.fieldDir('foo');
    let num = 2;
    rootDir.field('bar', () => num, (v: number) => { num = v; });

    const schema = s.getSchema();
    expect(schema).toEqual({
      type: 'group',
      childs: {
        foo: {
          type: 'group',
          childs: {
            bar: {
              type: 'field',
              value: 2,
              opt: {},
            },
          },
          opt: { isFolder: true, readOnly: true },
        },
      },
      opt: {},
    });
  });

  it('getSchema includes export: false fields', () => {
    const s = new Serializable();
    let val = 42;
    s.field('visible', () => val, (v: number) => { val = v; });
    s.field('hidden', () => val, (v: number) => { val = v; }, { export: false });

    const schema = s.getSchema();
    expect(schema.type).toBe('group');
    if (schema.type === 'group') {
      expect(schema.childs['visible']).toBeDefined();
      expect(schema.childs['hidden']).toBeDefined();
    }

    // serialize should exclude hidden
    const json = s.serialize();
    expect(json).toEqual({ visible: 42 });
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
