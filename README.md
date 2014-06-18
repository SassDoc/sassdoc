# SassDoc

SassDoc. Like JSDoc, but for Sass files.

## Example

```scss
// Returns the opposite direction of each direction in the given list
// ---
// @param {list} $positions - list of positions
// ---
// @return [string | null]

@function opposite-direction($positions) {
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

### Name

Self parsed.

### Scope

Either of the 3. None is considered `@public`.

```scss
// @private
// @public
// @protected
```

### Parameters

```scss
// @param [type] $name: description
// @param [type] $name (default value): description
```

### Return

```scss
// @return [type]
```

### Description

Any line which is not one of the previous tokens or a separator line is considered part of the description.

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.