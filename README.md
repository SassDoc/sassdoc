# SassDoc

SassDoc. Like JSDoc, but for Sass files.

## Example

```scss
// Function description
// ... on several lines if you will
// ---
// @private
// ---
// @deprecated since v4.2
// ---
// @alias other-function
// ---
// @param {type} $parameter-name - description of the parameter
// ---
// @returns {string | null} description of the returned value

@function dummy-function($parameter-name) {
  // ...
}
```

![SassDoc](http://i.imgur.com/BrzU2Ic.png)

*Note: it works exactly the same with mixins.*

## Installation

```sh
git clone https://github.com/HugoGiraudel/SassDoc.git
npm install -g ./SassDoc
```

## Usage

### Command line

```sh
sassdoc <src> <dest> [options]
```

Or if installed locally:

```sh
bin/sassdoc <src> <dest> [options]
```

#### Arguments

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

#### Options

* `-h, --help`: bring help
* `-v, --verbose`: run in verbose mode

### [WIP] Node API

```js
var sassdoc = require('sassdoc');

sassdoc.parse(__dirname + '/sass').then(function (items) {
  console.log(items);
})
```

## API Documentation

### Name

Name of the documented function/mixin is self parsed, hence `@name` doesn't exist.

### Description

Describes the documented function/mixin. Any line which is nota valid token or a separator line is considered part of the description.

### @access

Defines the access of the documented function/mixin. None is considered `@access public`.

```scss
// @access private
// @access public
// @access protected
```

It is also possible to define access like this:

```scss
// @private
// @public
// @protected
```

### @alias

Defines if the documented function/mixin is an alias of another function.

```scss
// @alias other-function
```

### @author

Describes the author of the documented function/mixin.

```scss
// @author Author's name
```

### @deprecated

Defines if the documented documented function/mixin is deprecated. Message is optional.

```scss
// @deprecated
// @deprecated Deprecation related message
```

### @ignore

Defines a line which won't be documented.

```scss
// @ignore Message
```

### @link

Describes a link.

```scss
// @link http://some.url
// @link http://some.url Optional caption
```

### @param

Describes a parameter of the documented function/mixin. Default value is optional. `@arg`, `@argument` and `@parameter` are accepted as well.

```scss
// @param {type} $name - description
// @param {type} $name (default value) - description of the parameter
```

### @requires

Defines if the documented function/mixin requires any other function/mixin.

### @returns

Describes the return statement of the documented function/mixin. Description is optional.

```scss
// @returns {type}
// @returns {type} Description of the return statement
```

### @throws

Describes the error thrown by the documented function/mixin.

```scss
// @throws Error related message
```

### @todo

Defines any task to do regarding the documented function/mixin.

```scss
// @todo Task to be done
```

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.