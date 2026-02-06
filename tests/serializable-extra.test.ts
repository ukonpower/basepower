import { describe, it, expect, vi } from 'vitest';
import { Serializable } from '../src/Serializable';

function createSimple() {
  const s = new Serializable();
  let val = 0;
  s.field('foo', () => val, (v: number) => { val = v; });
  return { s, get val() { return val; }, set val(v: number) { val = v; } };
}

describe('Serializable deserialize and field helpers', () => {
  it('updates fields via deserialize', () => {
    const { s } = createSimple();
    s.deserialize({ foo: 3 });
    expect(s.getField('foo')).toBe(3);
  });

  it('setField and getField mirror stored value', () => {
    const { s } = createSimple();
    s.setField('foo', 5);
    expect(s.getField('foo')).toBe(5);
  });

  it('emits fields/update event on setField', () => {
    const { s } = createSimple();
    const fn = vi.fn();
    s.on('fields/update', fn);
    s.setField('foo', 10);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith(['foo']);
  });

  it('emits fields/update/<path> event on setField', () => {
    const { s } = createSimple();
    const fn = vi.fn();
    s.on('fields/update/foo', fn);
    s.setField('foo', 20);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('getField returns undefined for unregistered path', () => {
    const { s } = createSimple();
    expect(s.getField('nonexistent')).toBeUndefined();
  });

  it('fieldDir creates nested fields accessible via getField', () => {
    const s = new Serializable();
    const dir = s.fieldDir('group');
    let x = 10;
    dir.field('x', () => x, (v: number) => { x = v; });

    expect(s.getField('group/x')).toBe(10);
    s.setField('group/x', 42);
    expect(x).toBe(42);
  });
});
