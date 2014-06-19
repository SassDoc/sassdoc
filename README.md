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

```sh
sassdoc <src> <dest>
```

Or if installed locally:

```sh
bin/sassdoc <src> <dest>
```

### Arguments

1. `<src>` Path to your Sass folder.
1. `<dest>` Path to the destination folder.

## Description block

### Alias

Defines if the documented function/mixin is an alias of another function.

```scss
// @alias other-function
```

### Author

Describes the author of the documented function/mixin.

```scss
// @author Author's name
```

### Deprecated

Defines if the documented documented function/mixin is deprecated. Message is optional.

```scss
// @deprecated
// @deprecated Deprecation related message
```

### Description

Describes the documented function/mixin. Any line which is nota valid token or a separator line is considered part of the description.

### Ignore

Defines a line which won't be documented.

```scss
// @ignore Message
```

### Name

Name of the documented function/mixin is self parsed, hence `@name` doesn't exist.

### Parameters

Describes a parameter of the documented function/mixin. Default value is optional.

```scss
// @param {type} $name - description
// @param {type} $name (default value) - description of the parameter
```

### Return

Describes the return statement of the documented function/mixin. Description is optional.

```scss
// @returns {type}
// @returns {type} Description of the return statement
```

### Scope

Defines the scope of the documented function/mixin. None is considered `@public`.

```scss
// @private
// @public
// @protected
```

### Throws

Describes the error thrown by the documented function/mixin.

```scss
// @throws Error related message
```

### Todos

Defines any task to do regarding the documented function/mixin.

```scss
@todo Task to be done
```

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.