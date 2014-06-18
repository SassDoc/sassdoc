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

Notes:

* Works exactly the same with mixins
* `// ---` lines are skipped
* Any line which is neither a recognized tag, nor a separator is considered part of description

## Credits

Huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for the help.