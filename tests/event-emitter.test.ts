import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../src/EventEmitter';

describe('EventEmitter', () => {
  it('on/emit calls registered callback', () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();
    emitter.on('test', fn);
    emitter.emit('test');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('emit passes args to callback', () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();
    emitter.on('data', fn);
    emitter.emit('data', [1, 'hello', true]);
    expect(fn).toHaveBeenCalledWith(1, 'hello', true);
  });

  it('once fires callback only once', () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();
    emitter.once('one', fn);
    emitter.emit('one');
    emitter.emit('one');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('off removes a specific callback', () => {
    const emitter = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    emitter.on('ev', fn1);
    emitter.on('ev', fn2);
    emitter.off('ev', fn1);
    emitter.emit('ev');
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledOnce();
  });

  it('off without callback removes all listeners for event', () => {
    const emitter = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    emitter.on('ev', fn1);
    emitter.on('ev', fn2);
    emitter.off('ev');
    emitter.emit('ev');
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it('hasEvent returns true when listeners exist', () => {
    const emitter = new EventEmitter();
    expect(emitter.hasEvent('test')).toBe(false);
    emitter.on('test', () => {});
    expect(emitter.hasEvent('test')).toBe(true);
  });

  it('hasEvent returns false after off', () => {
    const emitter = new EventEmitter();
    emitter.on('test', () => {});
    emitter.off('test');
    expect(emitter.hasEvent('test')).toBe(false);
  });

  it('multiple events are independent', () => {
    const emitter = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    emitter.on('a', fn1);
    emitter.on('b', fn2);
    emitter.emit('a');
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).not.toHaveBeenCalled();
  });
});
