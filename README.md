# SassDoc

SassDoc. Like JSDoc, but for Sass files.

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

### Available tokens

#### Name

Self parsed.

#### Scope

Either of the 3. None is considered `@public`.

```scss
// @private
// @public
// @protected
```

#### Parameters

```scss
// @param [type] $name (default value): description
```

#### Return

```scss
// @return [type]
```

#### Description

Any line which is not one of the previous tokens or a separator line is considered part of the description.

### Example

```scss
// Description ...
// ... on multiple lines if you will
// ---
// @private
// ---
// @param [type] $parameter (default value): description of the parameter
// ---
// @return [type]

@function whatever($parameter: default value) {
  // ...
}
```

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.