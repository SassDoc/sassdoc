# Changelog

## 1.0.0rc.7

* Fixed an issue where links were not displayed
* Added `--version` option
* Improved Sass and Swig structure
* Improved the way we display `@deprecated`

## 1.0.0rc.6

* Added location where item was found
* Moved view's stylesheets to Sass
* Changed the folder structure
* Moved `view.json` to `view/` folder

## 1.0.0rc.5

* Improved view
* Prevented some broken links
* Made the documentation responsive
* Added PrismJS
* Fixed an issue with `@requires` type
* Fixed some formatting issues with `@example`

## 1.0.0rc.4

* Fixed an issue prevented `@requires` form working if there was any `@alias`

## 1.0.0rc.3

* Greatly improved the view

## 1.0.0rc.2

* Fixed `@deprecated` not supporting a message
* Added a trim to `@datatype`

## 1.0.0rc.1

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