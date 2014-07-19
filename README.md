# SassDoc [![NPM version](https://badge.fury.io/js/sassdoc.svg)](http://badge.fury.io/js/sassdoc) [![Build Status](https://travis-ci.org/SassDoc/sassdoc.svg?branch=master)](https://travis-ci.org/SassDoc/sassdoc)

Like JSDoc for your Sass files.

## Example

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

/**
 * Defines whether the lib should support legacy browsers (e.g. `IE 8`).
 *
 * @since 1.3.37
 *
 * @todo Nothing. It's awesome.
 *
 * @link https://github.com/SassDoc/sassdoc SassDoc
 *
 * @type Bool
 */
$legacy-support: true !global;
```

### Preview

![SassDoc](http://i.imgur.com/nQoXn0W.png)


## Installation

### npm

```sh
npm install -g sassdoc
```

### Grunt

See [grunt-sassdoc](https://github.com/SassDoc/grunt-sassdoc).

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
* ` --no-update-notifier`: Do not run the update notifier check.

### Node

#### Install

```shell
npm install sassdoc --save
```

#### Use The Raw Data

```js
var sassdoc = require('sassdoc');

sassdoc.parse(__dirname + '/sass').then(function (items) {
  console.log(items);
})
```

#### Generate Documentation

```js
var config = {
  "display": {
    "access": ["public", "private"],
    "alias": false,
    "watermark": true
  },

  "package": "./package.json"
}

var sassdoc = require('sassdoc');
sassdoc.documentize(source, dest, config);
```

## Documentating your items

See [Wiki](https://github.com/SassDoc/sassdoc/wiki/Documenting-your-items).

## Customising the view

See [Wiki](https://github.com/SassDoc/sassdoc/wiki/Customizing-the-view).

## Built with SassDoc

* [SassyIcons](http://pascalduez.github.io/SassyIcons/docs/) from Pascal Duez
* [SassyFilters](http://pascalduez.github.io/SassyFilters/docs/) from Pascal Duez
* [SassyLists](http://sassylists.com/documentation.html) from Hugo Giraudel

## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)
* [Pascal Duez](https://twitter.com/pascalduez)
