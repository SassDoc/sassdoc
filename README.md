# SassDoc

SassDoc. Like JSDoc, but for Sass files.

Currently only work for `.scss` files. Also, inline comments are not parsed (`//`).

## Example

### Function/mixin

```scss
/**
 * Adds `$value` at `$index` in `$list`.
 *
 * @author Hugo Giraudel
 *
 * @ignore Documentation: http://sassylists.com/documentation/#insert-nth
 *
 * @requires is-true
 *
 * @param {List}   $list  - list to update
 * @param {Number} $index - index to add
 * @param {*}      $value - value to add
 *
 * @throws List index $index is not a number for `insert-nth`.
 * @throws List index $index must be a non-zero integer for `insert-nth`.
 *
 * @return {List | Null}
 */

@function insert-nth($list, $index, $value) {
  // ...
}
```

### Variable

```scss
/**
 * Defines whether the lib should support legacy browsers (e.g. `IE 8`).
 * ---
 * @since 0.3.9
 * @todo Nothing. It's awesome.
 * @link https://github.com/HugoGiraudel/SassDoc SassDoc
 * @datatype Bool
 */
$legacy-support: true !global;
```

### Preview

![SassDoc](http://i.imgur.com/GnNo4HB.png)

## Installation

### NPM

```sh
npm install -g sassdoc
```

### Grunt

See [grunt-sassdoc](https://github.com/pascalduez/grunt-sassdoc).

## Usage

### Command line

```sh
sassdoc <src> <dest> [options]
```

**Arguments:**

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

**Options:**

* `-h, --help`: Bring help.
* `--version`: Show version.
* `-v, --verbose`: Run in verbose mode.
* `-c, --config`: Path to JSON file containing variables to be passed
                  to the view.

### Node

```js
var sassdoc = require('sassdoc');

sassdoc.parse(__dirname + '/sass').then(function (items) {
  console.log(items);
})
```

## Documentation

See [Wiki](https://github.com/HugoGiraudel/SassDoc/wiki/Documentation).

## Pass extra variables to the view

With the `-c` or `--config` flag, you can set the path to a JSON file containing variables to be passed to the view so the latter is a little more customized than the default documentation. 

Default path leads to `view/view.json`. You can update this file or make your own.

Allowed variables:

```json
{
  "display": {
    "access": ["public", "private"],
    "alias": false,
    "watermark": true
   },

  "package": "../package.json"
}
```

* (`Array`) `display.access`: access levels that should be displayed
* (`Boolean`) `display.alias`: enable/disable display of alias items
* (`Boolean`) `display.watermark`: mention to SassDoc in footer (be cool, leave it!)
* (`String|Object`) `package`: path to a .json file (ideally your `package.json`) or directly an object

The package object (either direct or required) should ideally contain:

* `name`
* `version`
* `license`
* `homepage`
* `description`

## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)

With huge contributions from:

* [Pascal Duez](https://twitter.com/pascalduez)