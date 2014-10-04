# Changelog

## 1.9.0

* Added ability to use inline comments with `///` ([#143](https://github.com/SassDoc/sassdoc/issues/143))
* Added some safeguards when wiping the destination folder to avoid accidents ([#220](https://github.com/SassDoc/sassdoc/issues/220))
* Added `@content` annotation, which is auto-filled when `@content` Sass directive is being found in a mixin ([#226](https://github.com/SassDoc/sassdoc/issues/226))
* Added `@require` alias for `@requires` ([#221](https://github.com/SassDoc/sassdoc/issues/221))
* Added `@property` alias for `@prop` ([#221](https://github.com/SassDoc/sassdoc/issues/221))
* Made the `$` sign optional when writing the parameter name in `@param` ([#222](https://github.com/SassDoc/sassdoc/issues/222))
* Annotations that should not be associated to certain types (for instance `@param` for a variable) now emit a warning and are properly discarded by the parser ([CDocParser#4](https://github.com/FWeinb/CDocParser/issues/4))

## 1.8.0

* Added ability to add your own annotations to your theme ([#203](https://github.com/SassDoc/sassdoc/issues/203))
* Fixed an issue with items being randomly ordered ([#208](https://github.com/SassDoc/sassdoc/issues/208))
* Greatly improved sidebar from the theme

## 1.7.0

* Added a `--sass-convert` option to perform Sass to SCSS conversion before running SassDoc
([#183](https://github.com/SassDoc/sassdoc/issues/183#issuecomment-56262743))
* Added the ability to define annotations at a file-level ([#190](https://github.com/SassDoc/sassdoc/issues/190))
* Improved SassDoc's behaviour when default theme is missing ([#207](https://github.com/SassDoc/sassdoc/pull/207))
* Slightly improved our logging message regarding the theme being used ([#206](https://github.com/SassDoc/sassdoc/issues/206))
* Moved some logic out of the theme's templates right into the index.js from the theme ([sassdoc-theme-light#40](https://github.com/SassDoc/sassdoc-theme-light/issues/40))

## 1.6.1

* Fixed a bug where some descriptions didn't allow line breaks ([#209](https://github.com/SassDoc/sassdoc/issues/209))

## 1.6.0

* Added a [Yeoman Generator](https://github.com/SassDoc/generator-sassdoc-theme) to make it easier to build themes ([#185](https://github.com/SassDoc/sassdoc/issues/185))
* Added YAML support for configuration files; default configuration file name is still `view`, either as `.json`, `.yaml` or `.yml` ([#184](https://github.com/SassDoc/sassdoc/issues/184))
* Added a message to warn against relying on the default configuration file name (`view.{json,yaml,yml}`) since it will break in version 2.0.0 in favor of `.sassdocrc` (which will support both format at once while being more semantic, less confusing and less likely to conflict with other projects) ([#194](https://github.com/SassDoc/sassdoc/issues/194))
* Fixed an issue when variable items' value contains a semi-colon ([#191](https://github.com/SassDoc/sassdoc/issues/191))
* Improved the light theme (better sidebar toggle with states stored in localStorage, better code toggle, better JavaScript structure, and better performance)
* Added a `byType` key to sassdoc-indexer to help building themes

## 1.5.2

* Added implicit type for required placeholders ([#197](https://github.com/SassDoc/sassdoc/issues/197))

## 1.5.1

* Used `stat` instead of `lstat` to support symlinks ([22a9b79](https://github.com/SassDoc/sassdoc/commit/22a9b7986e1eef2bf962bb9b1a48467d257ee398))

## 1.5.0

* Added `@prop` to allow deeper documentation for maps ([#25](https://github.com/SassDoc/sassdoc/issues/25))
* Fixed circular JSON dependencies when using raw data ([#181](https://github.com/SassDoc/sassdoc/issues/181))
* Added an option to provide a custom shortcut icon to the view ([#178](https://github.com/SassDoc/sassdoc/issues/178))

## 1.4.1

* Fixed a broken test

## 1.4.0

* Updated favicon from theme to prevent 404
* Changed a dependency
* Added placeholder support ([#154](https://github.com/SassDoc/sassdoc/issues/154))
* Prevented a crash when using invalid annotations; throwing a warning instead
* Added `@source` as an alias for `@link` to carry more semantic ([#170](https://github.com/SassDoc/sassdoc/issues/170))

## 1.3.2

* Fixed a broken test

## 1.3.1

* Merged a branch that needed to be merged

## 1.3.0

* Added `@output` as an equivalent for `@return` for mixins ([#133](https://github.com/SassDoc/sassdoc/issues/133))
* Added the ability to add a title to `@example` ([#145](https://github.com/SassDoc/sassdoc/issues/145))
* Added the ability to preview the code of an item when clicking on it ([#124](https://github.com/SassDoc/sassdoc/issues/124))

## 1.2.0

* Improved the way `@since` is parsed ([#128](https://github.com/SassDoc/sassdoc/issues/128))
* Moved theming to [Themeleon](https://github.com/themeleon/themeleon) ([#69](https://github.com/SassDoc/sassdoc/issues/69))
* Added a *view source* feature ([#117](https://github.com/SassDoc/sassdoc/issues/117))
* Added the `@group` annotation, as well as a way to alias groups in order to have friendly names ([#29](https://github.com/SassDoc/sassdoc/issues/29))
* Added moar tests ([#138](https://github.com/SassDoc/sassdoc/issues/138))

## 1.1.6

* Backport, fixed `found-at` with absolute path ([#156](https://github.com/SassDoc/sassdoc/pull/156))

## 1.1.5

* Fixed `@example` not being printed for variables ([#146](https://github.com/SassDoc/sassdoc/pull/146))

## 1.1.4

* Fixed some visual issues with `@requires` ([#132](https://github.com/SassDoc/sassdoc/pull/132))

## 1.1.3

* Removed a duplicated `deprecated` flag in the view

## 1.1.2

* Fixed a bug with relative path to `package.json` file

## 1.1.1

* Fixed a small issue with display path, sometimes adding an extra slash ([#68](https://github.com/SassDoc/sassdoc/issues/68))

## 1.1.0

* New design
* Improved the `@requires` annotation to support external vendors, and custom URL ([#61](https://github.com/SassDoc/sassdoc/issues/61))
* Added a search engine to the generated documentation ([#46](https://github.com/SassDoc/sassdoc/issues/46))
* Fixed an issue with `@link` not working correctly ([#108](https://github.com/SassDoc/sassdoc/issues/108))
* Added `examples` to `.gitignore`

## 1.0.2

* Fixed an issue with config path resolving to false ([#68](https://github.com/SassDoc/sassdoc/issues/68))

## 1.0.1

* Worked around a npm bug

## 1.0.0

* Fixed an issue with a missing dependency
* Prevented a weird bug with `@require`
* Improved styles from the theme
* Improved the way we deal with configuration resolving
* Added an option to prevent the notifier check from happening
* Merged `sassdoc-cli` back into the main repository
* Fixed an issue with item count in console ([#102](https://github.com/SassDoc/sassdoc/issues/102))
* Made parameters table headers WAI 2.0 compliant ([#101](https://github.com/SassDoc/sassdoc/pull/101))
* Fixed a logic issue in the view
* Fixed a syntax highlighting issue with functions and mixins ([#99](https://github.com/SassDoc/sassdoc/pull/99))
* Improved the way we deal with file path ([#98](https://github.com/SassDoc/sassdoc/pull/98))
* Made it possible to use `@`-starting lines within `@example` as long as they are indented ([#96](https://github.com/SassDoc/sassdoc/pull/96))
* Fixed a tiny parser issue ([#95](https://github.com/SassDoc/sassdoc/pull/95))
* Exposed the version number in `sassdoc.version` ([#91](https://github.com/SassDoc/sassdoc/pull/93))
* Implemented `update-notifier` ([#92](https://github.com/SassDoc/sassdoc/issues/92))
* Made it possible for SassDoc to create nested folders ([#89](https://github.com/SassDoc/sassdoc/issues/89))
* Renamed all repositories to follow strict guidelines ([#70](https://github.com/SassDoc/sassdoc/issues/70))
* Fixed an issue with empty documented items ([#84](https://github.com/SassDoc/sassdoc/issues/84))
* Normalized description in annotations ([#81](https://github.com/SassDoc/sassdoc/issues/81))
* Made requiring a variable less error-prone ([#74](https://github.com/SassDoc/sassdoc/issues/74))
* Fixed minor issues when parsing `@param` ([#59](https://github.com/SassDoc/sassdoc/issues/59), [#60](https://github.com/SassDoc/sassdoc/issues/60), [#62](https://github.com/SassDoc/sassdoc/issues/62))
* Fixed an issue with `@import` being parsed ([#73](https://github.com/SassDoc/sassdoc/issues/73))
* Added language detection to `@example` ([#54](https://github.com/SassDoc/sassdoc/issues/54))
* Major style changes ([#65](https://github.com/SassDoc/sassdoc/issues/65))
* Improved view/DOM/SCSS structure
* Added Grunt ([#55](https://github.com/SassDoc/sassdoc/issues/55))
* Removed Makefile from core
* Added Travis ([#63](https://github.com/SassDoc/sassdoc/issues/63))
* Minor code improvements in bin
* Fixed an issue with bin
* Fixed some little bugs in view
* Changed `@datatype` to `@type`
* Fixed a parsing bug with expanded licenses in package.json
* Added a footer ([#57](https://github.com/SassDoc/sassdoc/issues/57))
* Changed the structure of `view.json`
* Added license (MIT) ([#58](https://github.com/SassDoc/sassdoc/issues/58))
* Massively improved templates quality
* Massively improved SCSS quality
* Authorized markdown on `@author`
* Added a favicon
* Fixed tiny typo in console warning
* Added anchor to each item ([#56](https://github.com/SassDoc/sassdoc/issues/56))
* Added back the `[Private]` annotation before private items' name
* Added a `version` parameter to `view.json` that gets displayed right next to the title
* Prevented empty sections in case items exist but are not displayed
* Prevented broken links with requires and usedby in case of private items
* Fixed an issue where links were not displayed
* Added `--version` option ([#51](https://github.com/SassDoc/sassdoc/issues/51))
* Improved Sass and Swig structure
* Improved the way we display `@deprecated` ([#50](https://github.com/SassDoc/sassdoc/issues/50))
* Added location where item was found
* Moved view's stylesheets to Sass
* Changed the folder structure
* Moved `view.json` to `view/` folder
* Prevented some broken links
* Made the documentation responsive
* Added PrismJS
* Fixed an issue with `@requires` type
* Fixed some formatting issues with `@example`
* Fixed an issue prevented `@requires` form working if there was any `@alias`
* Greatly improved the view
* Fixed `@deprecated` not supporting a message
* Added a trim to `@datatype`
* Moved to a real parser ([CDocParser](https://github.com/FWeinb/CDocParser) and [ScssCommentParser](https://github.com/FWeinb/ScssCommentParser))
* Dropped support for inline comments (`//`)
* Added the ability to document examples with `@example`
* Variables are now documented exactly like functions and mixins, yet they have a `@datatype` directive to specify their type
* Changed the structure of `view.json`

## 0.4.1

* Improved the way we can impact the view with `view.json`

## 0.4.0

* Added a way to impact the view with `view.json`

## 0.3.9

* Greatly improved the way we deal with variables

## 0.3.8

* Fixed documented items count in generated documentation
* Improved the way things work when nothing gets documented

## 0.3.7

* Allowed markdown syntax at more places

## 0.3.6

* Authorized `spritemap` as a valid type

## 0.3.5

* Changed the way we deal with assets dumping

## 0.3.4

* Fixed an issue when dumping assets

## 0.3.3

* Who knows?

## 0.3.2

* Updated view

## 0.3.1

* Fixed a potential path issue

## 0.3.0

* Added `@since`

## 0.2.1

* Updated the way we deal with `@param` and `@return`

## 0.1.0

* Initial commit
