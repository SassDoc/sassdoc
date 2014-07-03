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
  access: 'private',
  since: '0.3.8'
}
```

## API Documentation

### Name

Name of the documented function/mixin is self parsed, hence `@name` doesn't exist.

### Description

Describes the documented function/mixin. Parsed as markdown.

For functions and mixins, any line which is not a valid token or a separator line is considered part of the description. 

For variables, see `@var`.

### @access

**Allowed on:** functions, mixins, variables.

Defines the access of the documented item. 

```scss
// @access private
// @access public
// @access protected
```

**Notes:**

* None is considered `public` for functions and mixins, `private` for variables.

### @alias

**Allowed on:** functions, mixins.

Defines if the documented item is an alias of another function.

```scss
// @alias other-function
```

**Notes:**

* The other item will automatically have a key named `aliased` containing the name of aliases.

### @author

**Allowed on:** functions, mixins.

Describes the author of the documented item.

```scss
// @author Author's name
```

### @deprecated

**Allowed on:** functions, mixins, variables.

Defines if the documented documented item is deprecated.

```scss
// @deprecated
// @deprecated Deprecation related message
```

**Notes:**

* Message is optional.
* Message is parsed as markdown.

### @ignore

**Allowed on:** functions, mixins.

Defines a line which won't be documented. 

```scss
// @ignore Message
```

**Notes:**

* Multiple `@ignore` allowed on the same item.

### @link

**Allowed on:** functions, mixins, variables.

Describes a link. 

```scss
// @link http://some.url
// @link http://some.url Optional caption
```

**Notes:**

* Caption is optional.
* Multiple `@link` allowed on the same item.

### @param (synonyms: @arg, @argument)

**Allowed on:** functions, mixins.

Describes a parameter of the documented item.

```scss
// @param {type | othertype} $name
// @param {type} $name - description
// @param {type} $name (default value) - description of the parameter
```

**Notes:**

* Type should be any of: `arglist`, `bool`, `color`, `list`, `map`, `null`, `number`, `spritemap` (for Compass sprites), `string` or `*` when any type is allowed. 
* Type is case insensitive.
* Default value is optional.
* Description is optional.
* Description is parsed as markdown.

### @requires

**Allowed on:** functions, mixins.

Defines if the documented item requires any other item. 

```scss
// @requires other-function
```

**Notes:**

* The other item will automatically have a key named `usedBy` containing the name of function requiring it.
* Multiple `@requires` allowed on the same item.

### @returns (synonym: @return)

**Allowed on:** functions.

Describes the return statement of the documented item.

```scss
// @returns {type | othertype}
// @returns {type} Description of the return statement
```

**Notes:**

* Type should be any of: `arglist`, `bool`, `color`, `list`, `map`, `null`, `number`, `spritemap` (for Compass sprites), `string` or `*` when any type is allowed. 
* Type is case insensitive.
* Description is optional.
* Description is parsed as markdown.

### @since

**Allowed on:** functions, mixins, variables.

Describes the version at which the documented item has been implemented.

```scss
// @since 4.2
```

**Notes:**

* Description is parsed as markdown.

### @throws (synonym: @exception)

**Allowed on:** functions, mixins.

Describes the error thrown by the documented item. 

```scss
// @throws Error related message
```

**Notes:**

* Description is parsed as markdown.
* Multiple `@throws` allowed on the same item.

### @todo

**Allowed on:** functions, mixins, variables.

Defines any task to do regarding the documented item.

```scss
// @todo Task to be done
```

**Notes:**

* Description is parsed as markdown.
* Multiple `@todo` allowed on the same item.

### @var

**Allowed on:** variables.

Describes a variable.

```scss
// @var {Bool} - Defines whether the library should support legacy browsers (e.g. IE8).
$legacy-support: true !global;
```

**Notes:**

* Has nothing to do with function/mixin. 

## Credits

* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)