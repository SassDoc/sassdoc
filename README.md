# SassDoc

Like JSDoc for your Sass files.

* Usable out of the box.
* Highly customisable.
* Reasonably fast.
* Fully themable.
* Integrated with Grunt/Gulp/Broccoli or directly Node.

![SassDoc](http://sassdoc.com/preview-image.png)
---

master: [![Build Status](https://travis-ci.org/SassDoc/sassdoc.svg?branch=master)](https://travis-ci.org/SassDoc/sassdoc)
develop: [![Build Status](https://travis-ci.org/SassDoc/sassdoc.svg?branch=develop)](https://travis-ci.org/SassDoc/sassdoc)

[![NPM](https://nodei.co/npm/sassdoc.png?downloads=true)](https://nodei.co/npm/sassdoc/)

## How does it work?

[SassDoc](http://github.com/sassdoc/sassdoc) parses your source folder to grab documentation-specific comments. From there, it builds a data tree, that gets [enhanced](http://github.com/sassdoc/sassdoc-indexer) and [filtered](http://github.com/sassdoc/sassdic-filter) before being passed to the [view](http://github.com/sassdoc/sassdoc-theme-light). So you end up with a fully styled HTML document located at your destination folder.

## Usage

### Command line

#### Install

```sh
npm install -g sassdoc
```

#### Generate Documentation

```sh
sassdoc <src> <dest> [options]
```

**Arguments:**

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

**Options:**

* `--version`: Show version.
* `-h, --help`: Bring help.
* `-v, --verbose`: Run in verbose mode.
* `-c, --config`: Path to JSON file containing variables to be passed to the view.
* `-t, --theme`: Theme to be required. It will override the configuration value.
* `--no-update-notifier`: Do not run the update notifier check.

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
  display: {
    access: ['public', 'private'],
    alias: false,
    watermark: true,
  },

  package: 'path/to/package.json', // Defaults to `./package.json`
  theme: 'theme-name', // Defaults to `default`
};

var sassdoc = require('sassdoc');
sassdoc.documentize(source, dest, config);
```

### Grunt, Gulp, Broccoli

See [grunt-sassdoc](https://github.com/SassDoc/grunt-sassdoc),
[gulp-sassdoc](https://github.com/SassDoc/gulp-sassdoc),
[broccoli-sassdoc](https://github.com/SassDoc/broccoli-sassdoc).



## Documentating your items

See [Wiki](https://github.com/SassDoc/sassdoc/wiki/Documenting-your-items).



## Customising the view

See [Wiki](https://github.com/SassDoc/sassdoc/wiki/Customising-the-view).



## Example

```scss
/**
 * Adds `$value` at `$index` in `$list`.
 *
 * @author Hugo Giraudel
 *
 * @requires {function} is-true
 *
 * @param {List}   $list  - list to update
 * @param {Number} $index - index to add
 * @param {*}      $value - value to add
 *
 * @throws List index $index is not a number for `insert-nth`.
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


## Built with SassDoc

* [GUSS](http://www.kaelig.fr/gu/guss-sassdoc/) from The Guardian
* [SassyIcons](http://pascalduez.github.io/SassyIcons/docs/) from Pascal Duez
* [SassyFilters](http://pascalduez.github.io/SassyFilters/docs/) from Pascal Duez
* [SassyLists](http://sassylists.com/documentation) from Hugo Giraudel
* [css-patterns](http://madebymany.github.io/css-patterns/) from madebymany
* [yy](http://astina.github.io/yy/) from Astina
* [Sassy Starter](http://minamarkham.github.io/sassy-starter/docs/) from archermalmo


## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Pascal Duez](https://twitter.com/pascalduez)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)

