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

#### Arguments

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

#### Options

* `-h, --help`: bring help
* `-v, --verbose`: run in verbose mode

### Node API

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
  access: 'global' 
}
```

## API Documentation

### Name

Name of the documented function/mixin is self parsed, hence `@name` doesn't exist.

### Description

Describes the documented function/mixin. Any line which is nota valid token or a separator line is considered part of the description. Parsed as markdown.

### @access

Defines the access of the documented function/mixin. None is considered `@access public`.

```scss
// @access private
// @access public
// @access protected
```

### @alias

Defines if the documented function/mixin is an alias of another function.

```scss
// @alias other-function
```

The other function will automatically have a key named `aliased` containing the name of aliases.

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

Description parsed as markdown.

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

Describes a parameter of the documented function/mixin. Default value and description are optional.

```scss
// @param {type | othertype} $name
// @param {type} $name - description
// @param {type} $name (default value) - description of the parameter
```

Description parsed as markdown.

Type is any of: `arglist`, `bool`, `color`, `list`, `map`, `null`, `number`, `spritemap` (for Compass sprites), `string` or `*` when any type is allowed. Case insensitive.

### @requires

Defines if the documented function/mixin requires any other function/mixin. Multiple `@requires` allowed on the same function/mixin.

```scss
// @requires other-function
```

The other function will automatically have a key named `usedBy` containing the name of function requiring it.

### @returns (synonym: @return)

Describes the return statement of the documented function/mixin. Description is optional.

```scss
// @returns {type | othertype}
// @returns {type} Description of the return statement
```

Description parsed as markdown.

Type is one of: `arglist`, `bool`, `color`, `list`, `map`, `null`, `number`, `spritemap` (for Compass sprites), `string` or `*` when any type is allowed. Case insensitive.

### @since

Describes the version at which the documented function/mixin has been implemented.

```scss
// @since 4.2
```

Description parsed as markdown.

### @throws (synonym: @exception)

Describes the error thrown by the documented function/mixin. Multiple `@throws` allowed on the same function/mixin.

```scss
// @throws Error related message
```

Description parsed as markdown.

### @todo

Defines any task to do regarding the documented function/mixin. Multiple `@todo` allowed on the same function/mixin.

```scss
// @todo Task to be done
```

Description parsed as markdown.

### @var

Describes a variable. Has nothing to do with function/mixin. 

```scss
// @var {Bool} - Defines whether the library should support legacy browsers (e.g. IE8).
$legacy-support: true !global;
```

Scope is defined by the (lack of) use of `!global`. 

## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)