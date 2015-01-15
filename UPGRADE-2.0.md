Upgrade from 1.0 to 2.0
=======================

Annotations
-----------

The default value of some annotations is now inside square brackets
instead of parentheses. This affects `@param`, `@prop` and `@require`.

###### Before

```scss
/**
  * @param {String} $foo (bar) - Baz.
  */
@function baz($foo) {}
```

###### After

```scss
/**
  * @param {String} $foo [bar] - Baz.
  */
@function baz($foo) {}
```

You can use the following script to update your codebase, though
it will replace all the parentheses by square brackets in the lines
containing the affected annotations, which may not be what you want
(for example if there's parentheses inside the default value or in
the description).

Be sure to review the changes made by the script and eventually fix
details by hand.


###### GNU `sed`

```sh
find . -type f -name '*.s[ac]ss' -exec sed -ri '/@param|@prop|@require/y/()/[]/' {} +
```

###### BSD/Mac `sed`

```sh
find . -type f -name '*.s[ac]ss' -exec sed -Ei '' '/@param|@prop|@require/y/\(\)/\[\]/' {} +
```
CLI
---

The CLI usage slightly changed, since the destination is now optional
and configurable with an option instead of an argument, so you'll have
to update your scripts using SassDoc if you have any.

###### Before

```sh
sassdoc scss/ doc/
```

###### After

```sh
sassdoc scss/ --dest doc/
```

Node
----

The `documentize` function from 1.0 is now the default export from the
`sassdoc` module.

###### Before

```js
var sassdoc = require('sassdoc');

sassdoc.documentize('scss/').then(function () {
  console.log('All done!');
});
```

###### After

```js
var sassdoc = require('sassdoc');

sassdoc('scss/').then(function () {
  console.log('All done!');
});
```

The `parse` function still works the same way as in 1.0.
