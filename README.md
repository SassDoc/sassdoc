# SassDoc

SassDoc. Like JSDoc, but for Sass files.

## Example

```scss
// Function description
// ... on several lines if you will
// ---
// @access private
// ---
// @alias other-function
// ---
// @param {Literal} $parameter-name            - description of the parameter
// @param {String}  $other-parameter (default) - parameter with a default value
// @param {ArgList} $args                      - extra parameters
// ---
// @return {String | null} description of the returned value

@function dummy-function($parameter-name, $other-parameter: 'default', $args...) {
  // ...
}
```

![SassDoc](http://i.imgur.com/RCCC44h.png)

*Note: it works exactly the same with mixins.*

## Installation

```sh
npm install -g sassdoc
```

## Usage

### Command line

```sh
sassdoc <src> <dest> [options]
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

Defines a line which won't be documented. Multiple `@ignore` allowed on the same function/mixin.

```scss
// @ignore Message
```

### @link

Describes a link. Multiple `@link` allowed on the same function/mixin.

```scss
// @link http://some.url
// @link http://some.url Optional caption
```

### @param (synonyms: @arg, @argument)

Describes a parameter of the documented function/mixin. Default value is optional. `@arg`, `@argument` and `@parameter` are accepted as well.

```scss
// @param {type} $name - description
// @param {type} $name (default value) - description of the parameter
```

### @requires

Defines if the documented function/mixin requires any other function/mixin. Multiple `@requires` allowed on the same function/mixin.

```scss
// @requires other-function
```

### @returns (synonym: @return)
Describes the return statement of the documented function/mixin. Description is optional.

```scss
// @returns {type}
// @returns {type} Description of the return statement
```

### @throws (synonym: @exception)

Describes the error thrown by the documented function/mixin. Multiple `@throws` allowed on the same function/mixin.

```scss
// @throws Error related message
```

### @todo

Defines any task to do regarding the documented function/mixin. Multiple `@todo` allowed on the same function/mixin.

```scss
// @todo Task to be done
```

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.