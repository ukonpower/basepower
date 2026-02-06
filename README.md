# basepower

[![npm version](https://img.shields.io/npm/v/basepower.svg)](https://www.npmjs.com/package/basepower)
[![npm downloads](https://img.shields.io/npm/dm/basepower.svg)](https://www.npmjs.com/package/basepower)
[![license](https://img.shields.io/npm/l/basepower.svg)](./LICENSE)

Lightweight EventEmitter & Serializable primitives for TypeScript.

## Installation

```bash
npm install basepower
```

## Usage

```typescript
import { EventEmitter, Serializable } from 'basepower';
```

### EventEmitter

```typescript
const emitter = new EventEmitter();

emitter.on('data', (value) => console.log(value));
emitter.emit('data', [42]);
```

### Serializable

```typescript
const obj = new Serializable();

let hp = 100;
obj.field('hp', () => hp, (v) => { hp = v; });

obj.serialize();       // { hp: 100 }
obj.setField('hp', 50);
obj.deserialize({ hp: 75 });
```

## Documentation

[https://ukonpower.github.io/basepower/](https://ukonpower.github.io/basepower/)

## License

[MIT](./LICENSE) - Copyright (c) 2026 ukonpower
