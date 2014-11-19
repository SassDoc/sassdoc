# JavaScript coding guidelines

This is an extension to [Node Styleguide](https://github.com/felixge/node-style-guide) by Felix Geisendörfer. Anything from this document overrides what could be said in the Node Styleguide.

**Always lint code before pushing.**

## EOF

Always add a trailing blank line at end of file.

## String interpolation

When a string contains a variable, use backticks rather than single quotes to wrap it.

```js
console.log(`Theme: #{value}.`);
```

## Module imports

```js
import { foo } from './foo';
```

## Module exports

Exported functions and classes should always have a name, even if it's not required per see. Naming exports help debugging and figuring out what's going on.

```js
export default function foo() {}
export default class Bar {}
```

## Object description

Objects with 1 or 2 key/value pairs can be written either on a single line or on multiple lines, with no extra comma.

```js
let obja = { foo: 'foo' };
let objb = { foo: 'foo', bar: 'bar' };

f({ foo: 'foo' });
f({ foo: 'foo', bar: 'bar' });
```

Objects with at least 3 key/value pairs should be written with each pair on its own line. Last pair also has a trailing comma to make it easier to move lines around.

```js
let obj = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};

f({
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
});
```

## Inline documentation

Every function should be documented using [JSDoc](). Annotations should not be aligned in order not to have to update alignment whever a longer line is added.

```js
/**
 * @param {String} foo
 * @return {Boolean}
 * @see something
 */
```

## Variable declaration

Variable declarations, no matter with `var` or `let` should not be aligned.

```js
let a = 1;
let ba = 2;
```

## Arrow functions

```js
let x = () => {
  // ...
};
```

## Default arguments in functions

Equal symbol (`=`) should always be surrounded by spaces when defining default values for arguments in a function signature.

```js
function foo(bar = 'baz') {}
```

