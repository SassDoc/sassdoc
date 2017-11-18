# Changelog

## 2.5.0

  * Added support for async annotation resolve functions.
    ([#517](https://github.com/SassDoc/sassdoc/issues/517), [#518](https://github.com/SassDoc/sassdoc/pull/518))

## 2.4.0

  * Added support for scoped theme packages.
    ([#514](https://github.com/SassDoc/sassdoc/issues/514), [#515](https://github.com/SassDoc/sassdoc/pull/515))

## 2.3.0

 * Themes can now pass an `includeUnknownContexts` config key up to the parser.  
   Allows for including comments not necessarily linked to an item in final data.
   ([#498](https://github.com/SassDoc/sassdoc/pull/498))

## 2.2.2

 * Fix the `verbose` and `strict` flags throwing an exception when being passed
   from config or API params. ([#491](https://github.com/SassDoc/sassdoc/issues/491), [#490](https://github.com/SassDoc/sassdoc/issues/490))

## 2.2.1

 * Scope empty data message under the verbose flag. ([#488](https://github.com/SassDoc/sassdoc/issues/488), [#489](https://github.com/SassDoc/sassdoc/issues/489))
   This prevent unwanted console cluttering on certain build setup.
 * Remove empty data warning about CSS selectors.
   This is no longer relevant, since CSS selectors are supported (although not being promoted yet).

## 2.2.0

 * Batch upgrade dependencies, fix security warnings.
 * Upgrade transpilation to Babel 6.

## 2.1.20

* Add `argument` as an alias for `parameter` annotation.

## 2.1.19

* Fix expected line numbers from scss-comment-parser.

## 2.1.18

* Fix previous publish.

## 2.1.17

* Downgrade scss-comment-parser. ([#438](https://github.com/SassDoc/sassdoc/issues/438), [#439](https://github.com/SassDoc/sassdoc/issues/439))

## 2.1.16

* Upgrade scss-comment-parser. ([#21](https://github.com/SassDoc/scss-comment-parser/pull/21))

## 2.1.15

* Update Babel to 5.5 because of a bug with Babel 5.1 runtime.

## 2.1.14

* Make `access` work when not autofilled ([#399](https://github.com/SassDoc/sassdoc/issues/399))

## 2.1.13

* Default destination is relative to CWD ([#403](https://github.com/SassDoc/sassdoc/pull/403))

## 2.1.12

* More generic streaming success message ([#402](https://github.com/SassDoc/sassdoc/pull/402))

## 2.1.11

* Republish of 2.1.10 because of a failed npm publish.

## 2.1.10

* Strip `@example` indent ([#401](https://github.com/SassDoc/sassdoc/pull/401))

## 2.1.9

* Upgrade to Babel 5.1, fix zn issue with `Symbol`  ([#396](https://github.com/SassDoc/sassdoc/issues/396))

## 2.1.8

* Upgrade to Babel 5.0 ([#394](https://github.com/SassDoc/sassdoc/pull/394))
* Ensure `default` theme name is properly logged ([#393](https://github.com/SassDoc/sassdoc/pull/393))
* Several dependencies updates ([#392](https://github.com/SassDoc/sassdoc/pull/392))
* Switched to Eslint ([#388](https://github.com/SassDoc/sassdoc/pull/388))

## 2.1.0 &mdash; Polite Little Squid

* A [`@name` annotation](http://sassdoc.com/annotations/#name) has been added to make it possible to override an item's name ([#358](https://github.com/SassDoc/sassdoc/issues/358))
* A [`privatePrefix` option](http://sassdoc.com/customising-the-view/#private-prefix) has been added to make it possible to autofill `@access` ([#357](https://github.com/SassDoc/sassdoc/issues/357))
* [`description` and `descriptionPath` options](http://sassdoc.com/customising-the-view/#description) have been added to make it possible to provide a project wide description, as direct Markdown or a Markdown file ([#256](https://github.com/SassDoc/sassdoc/issues/256))
* A [`sort` option](http://sassdoc.com/customising-the-view/#sort) has been added to make it possible to order items based on a couple of criterias ([#239](https://github.com/SassDoc/sassdoc/issues/239))

## 2.0.9

* Update `sass-convert` version to prevent the 6to5-runtime issue described in ([#369](https://github.com/SassDoc/sassdoc/issues/369))

## 2.0.8

* Ensure specific 6to5 and 6to5-runtime version. ([#369](https://github.com/SassDoc/sassdoc/issues/369),
[8bab189](https://github.com/SassDoc/sassdoc/commit/8bab18915b9fa7df6c764bb3211ecfb7acc491b1))

## 2.0.7

* Fix group sorting. ([e506be0](https://github.com/SassDoc/sassdoc/commit/e506be01df1bdbb378cdfa015b221b8ff72843d0))

## 2.0.6

* Graceful relative paths in CLI and config file. ([#362](https://github.com/SassDoc/sassdoc/issues/362),
[c47dea1](https://github.com/SassDoc/sassdoc/commit/c47dea149771e995b1782fd917e48bec37df48f6))

## 2.0.5

* Fix an issue with relative path passed via CLI and configuration file ([#364](https://github.com/SassDoc/sassdoc/pull/364), [c47dea1](https://github.com/SassDoc/sassdoc/commit/c47dea149771e995b1782fd917e48bec37df48f6))

## 2.0.4

* Fix an issue with autofill and items that use a css keyword as name. ([#359](https://github.com/SassDoc/sassdoc/issues/359))
* Fix an issue where `.sassdocrc` was ignored when using Node.js API
([#363](https://github.com/SassDoc/sassdoc/issues/363))

## 2.0.3

* Fix the CLI synopsis, SassDoc can't be executed without arguments.

## 2.0.2

* Move to 6to5 3 in `selfContained` mode to avoid global scope pollution ([#354](https://github.com/SassDoc/sassdoc/issues/354#issuecomment-72464640))

## 2.0.1

* Fix debug `task.name` value, returning proper function name instead of something like `callee$1$0`.

## 2.0.0 &mdash; Shiny Streamy Octopus

### API breaks for users

* C-style comments (`/** */`) are no longer supported ([#326](https://github.com/SassDoc/sassdoc/issues/326))
* SassDoc now always outputs its own directory in the current folder ([#302](https://github.com/SassDoc/sassdoc/issues/302))
* `--dest` option has been added to define SassDoc's folder path for output, default is `sassdoc` ([#302](https://github.com/SassDoc/sassdoc/issues/302))
* `--no-prompt` option no longer exists since SassDoc outputs its own folder ([#302](https://github.com/SassDoc/sassdoc/issues/302))
* `--sass-convert` option no longer exists and is now implied ([#231](https://github.com/SassDoc/sassdoc/issues/231#issuecomment-63610647))
* Default name for configuration file is now `.sassdocrc` ([#189](https://github.com/SassDoc/sassdoc/issues/189))
* `@alias` can no longer be used on placeholders ([#263](https://github.com/SassDoc/sassdoc/issues/263))
* Annotations `@access`, `@content`, `@deprecated`, `@group`, `@output`, `@return` and `@type` are now restricted to one use per item ([#257](https://github.com/SassDoc/sassdoc/issues/257))
* Annotations `@param` and `@prop` now use square brackets (`[]`) for default values rather than parentheses (`()`) to avoid edge issues ([#303](https://github.com/SassDoc/sassdoc/issues/303))
* See [`UPGRADE-2.0.md`](https://github.com/SassDoc/sassdoc/blob/master/UPGRADE-2.0.md#annotations) to convert all your SassDoc comments.

### API breaks for theme builders

* `sassdoc-filter` and `sassdoc-indexer` repositories no longer exist and have been replaced by [sassdoc-extras](https://github.com/SassDoc/sassdoc-extras)
* `sassdoc-theme-light` repository no longer exists and has been replaced by [sassdoc-theme-default](https://github.com/SassDoc/sassdoc-theme-default)
* `html*` properties no longer exist when using Markdown filter from sassdoc-extras, initial values are now overwritten ([sassdoc-extras#6](https://github.com/SassDoc/sassdoc-extras/pull/6))
* `@return` no longer returns a name and a default value, only a type and a description ([#277](https://github.com/SassDoc/sassdoc/issues/277))
* `@content` no longer returns an `autogenerated` key, only a description ([#262](https://github.com/SassDoc/sassdoc/issues/262))
* `parameters` key from item now becomes `parameter` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* `requires` key from item now becomes `require` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* `returns` key from item now becomes `return` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* `throws` key from item now becomes `throw` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* `todos` key from item now becomes `todo` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* `prop` key from item now becomes `property` ([#225](https://github.com/SassDoc/sassdoc/issues/225))
* When using the display filter from sassdoc-extras, items are now fully removed rather than given a `display` key ([sassdoc-extras#11](https://github.com/SassDoc/sassdoc-extras/issues/11))

### API breaks for third party integration

* The node API has been revamped and unified.
* `sassdoc.documentize` does not exist anymore.
* `sassdoc(src [, config])` execute the full Documentation process, returns a Promise.
* `sassdoc([config])` execute the full Documentation process, returns a Stream of Vinyl files.
* `sassdoc.parse(src [, config])` returns a Promise with the full data object.
* `sassdoc.parse([config])` returns a Stream with the full data object.

### New features

* The whole API has been fully refactored in ES6 ([#231](https://github.com/SassDoc/sassdoc/issues/231))
* `$` sign is now optional when defining the name in `@parameter` annotation ([#222](https://github.com/SassDoc/sassdoc/issues/222))
* It is now possible to use file/folder exclusion patterns ([#228](https://github.com/SassDoc/sassdoc/issues/231))
* It is now possible to pipe SassDoc into `stdin` ([#315](https://github.com/SassDoc/sassdoc/pull/315))
* `--debug` option has been added to output information about current setup ([#311](https://github.com/SassDoc/sassdoc/issues/311))
* Default theme now has a `googleAnalytics` configuration accepting a Google Analytics tracking key ([sassdoc-theme-default#10](https://github.com/SassDoc/sassdoc-theme-default/pull/10))
* Default theme now has a `trackingCode` configuration accepting an arbitrary HTML snippet to be included before `</body>` ([sassdoc-theme-default#10](https://github.com/SassDoc/sassdoc-theme-default/pull/10))
* `@content` annotation is now correctly output in default theme ([sassdoc-theme-default#15](https://github.com/SassDoc/sassdoc-theme-default/issues/15))
* Default theme now displays the type as well as the name when cross-linking items (requirements, and so on...) ([sassdoc-theme-default#17](https://github.com/SassDoc/sassdoc-theme-default/issues/17))
* Error messages should now be more explicit, providing a file name and a line ([#282](https://github.com/SassDoc/sassdoc/issues/282))
* `--parse` option has been added to output raw parsing data as JSON from the CLI ([#318](https://github.com/SassDoc/sassdoc/issues/318))

### Bug fixes

* Autofill no longer capture `@throw` that are already defined with annotations ([#270](https://github.com/SassDoc/sassdoc/issues/270))
* Variables *view source* link now correctly supports start and end lines in default theme ([sassdoc-theme-default#21](https://github.com/SassDoc/sassdoc-theme-default/issues/21))
* Empty groups are no longer displayed in default theme ([sassdoc-theme-default#20](https://github.com/SassDoc/sassdoc-theme-default/issues/20))
* Variable content is no longer displayed as `safe` in ([sassdoc-theme-default#19](https://github.com/SassDoc/sassdoc-theme-default/issues/19))
* `@since` description is now parsed as Markdown in the default theme ([sassdoc-extras#8](https://github.com/SassDoc/sassdoc-extras/issues/8))
* `@deprecated` description is now parsed as Markdown in the default theme ([sassdoc-extras#7](https://github.com/SassDoc/sassdoc-extras/issues/7))

## 1.10.12

* Backport of `a994ed5` fix multiple require autofill ([#314](https://github.com/SassDoc/sassdoc/issues/314))

## 1.10.11

* Ensure `@todo` compat with docs and contrib ([#293](https://github.com/SassDoc/sassdoc/issues/293))

## 1.10.6

* Ensure proper type checking for `@see` annotation ([#291](https://github.com/SassDoc/sassdoc/issues/232))

## 1.10.3

* Prevented `@requires` to autofill dependency twice

## 1.10.2

* Fixed an issue with the folder wiping safeguard always aborting if folder is not empty without even prompting

## 1.10.1

* Updated a dependency in order to use new version of sassdoc-theme-default

## 1.10.0

* Made annotations `@throws`, `@requires` and `@content` fill themselves so you don't have to, unless told otherwise through the [`autofill` option](http://sassdoc.com/configuration/#autofill) ([#232](https://github.com/SassDoc/sassdoc/issues/232), [#238](https://github.com/SassDoc/sassdoc/issues/238))
* Added the ability to define `--sass-convert`, `--no-update-identifier` and `--no-prompt` options within the configuration file instead of CLI only ([#247](https://github.com/SassDoc/sassdoc/issues/247))
* Merged [sassdoc-filter](https://github.com/sassdoc/sassdoc-filter) and [sassdoc-indexer](https://github.com/sassdoc/sassdoc-indexer) into [sassdoc-extras](https://github.com/sassdoc/sassdoc-extras); theme authors are asked to use the new repository

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
