# SassDoc

SassDoc. Like JSDoc, but for Sass files.

## Example

### Function/mixin

```scss
// Adds `$value` at `$index` in `$list`.
//
// @author Hugo Giraudel
//
// @ignore Documentation: http://sassylists.com/documentation/#insert-nth
//
// @requires is-true
//
// @param {List}   $list  - list to update
// @param {Number} $index - index to add
// @param {*}      $value - value to add
//
// @throws List index $index is not a number for `insert-nth`.
// @throws List index $index must be a non-zero integer for `insert-nth`.
//
// @return {List | Bool}

@function insert-nth($list, $index, $value) {
  // ...
}
```

### Variable

```scss
// @var {Bool} - Defines whether the library should support legacy browsers (e.g. IE8).
//
// @since 0.3.8
//
// @access private

$legacy-support: true !global;
```

### Preview

![SassDoc](http://i.imgur.com/GnNo4HB.png)

## Installation

```sh
npm install -g sassdoc
```

## Usage

### Command line

```sh
sassdoc <src> <dest> [options]
```

**Arguments:**

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

**Options:**

* `-h, --help`: bring help
* `-v, --verbose`: run in verbose mode
* `-c, --config`: path to `.json` file containing variables to be passed to the view

### Node

```js
var sassdoc = require('sassdoc');

sassdoc.parse(__dirname + '/sass').then(function (items) {
  console.log(items);
})
```

Yielding a result like this:

```js
{
  'functions': [],
  'mixins': [],
  'variables': []
}
```

Where a function/mixin is like this:

```js
{
  'parameters': [
    { 'type': 'List',   'name': 'list',  'default': undefined, 'description': 'list to update' },
    { 'type': 'Number', 'name': 'index', 'default': undefined, 'description': 'index to add'   },
    { 'type': '*',      'name': 'value', 'default': undefined, 'description': 'value to add'   }
  ],
  'throws': [
    'List index $index is not a number for `insert-nth`.', 
    'List index $index must be a non-zero integer for `insert-nth`.'
  ],
  'alias': false,
  'aliased': [],
  'links': [],
  'todos': [],
  'requires': ['is-true'],
  'description': 'Adds `$value` at `$index` in `$list`.',
  'access': 'public',
  'deprecated': false,
  'author': "Hugo Giraudel",
  'returns': {
    'type': [
      'List', 
      'Bool'
    ],
    'description': ''
  },
  'type': 'function',
  'name': 'insert-nth'
}
```

And a variable like this:

```js
{ 
  type: 'variable',
  datatype: ['Bool'],
  description: 'Defines whether the lib should support legacy browsers (e.g. `IE 8`).',
  name: 'support-legacy',
  value: 'true',
  access: 'private',
  since: '0.3.8'
}
```

## Documentation

See [Wiki](https://github.com/HugoGiraudel/SassDoc/wiki/Documentation).

## Pass extra variables to the view

With the `-c` or `--config` flag, you can set the path to a JSON file containing variables to be passed to the view so the latter is a little more customized than the default documentation. 

Default path leads to the `view.json` file at root level. You can update this file or make your own.

Allowed variables:

* (`String`) `title`: title of the page
* (`Object`) `display`: see below
* (`Boolean`) `display.private`: enable/disable display of private items
* (`Boolean`) `display.alias`: enable/disable display of alias items

## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)