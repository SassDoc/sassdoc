# SassDoc

Like JSDoc for your Sass files.

![SassDoc](http://i.imgur.com/nQoXn0W.png)
---

master: [![Build Status](https://travis-ci.org/SassDoc/sassdoc.svg?branch=master)](https://travis-ci.org/SassDoc/sassdoc)
develop: [![Build Status](https://travis-ci.org/SassDoc/sassdoc.svg?branch=develop)](https://travis-ci.org/SassDoc/sassdoc)

[![NPM](https://nodei.co/npm/sassdoc.png?downloads=true)](https://nodei.co/npm/sassdoc/)


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

* `-h, --help`: Bring help.
* `--version`: Show version.
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


## Built with SassDoc

* [SassyIcons](http://pascalduez.github.io/SassyIcons/docs/) from Pascal Duez
* [SassyFilters](http://pascalduez.github.io/SassyFilters/docs/) from Pascal Duez
* [SassyLists](http://sassylists.com/documentation) from Hugo Giraudel
* [Kittn](http://wirepa.onjumpstarter.io/sassdoc/) from Sascha Fuchs
* [yy](http://astina.github.io/yy/) from Astina
* [Sassy Starter](http://minamarkham.github.io/sassy-starter/docs/) from archermalmo



## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)
* [Pascal Duez](https://twitter.com/pascalduez)
