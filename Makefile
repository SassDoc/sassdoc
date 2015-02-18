PATH := $(PWD)/node_modules/.bin:$(PATH)
SASSDOC := $(PWD)/bin/sassdoc
MOCHA := $(PWD)/node_modules/.bin/_mocha
BABEL_FLAGS = --experimental --loose all --optional selfContained

all: dist lint test

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist:
	rm -rf $@
	babel $(BABEL_FLAGS) src --out-dir $@

# Code quality
# ============

lint: .jshintrc
	jshint --verbose bin/sassdoc index.js src test

.jshintrc: .jshintrc.yaml
	js-yaml $< > $@

test: test/data/expected.stream.json dist
	$(MOCHA) test/**/*.test.js
	$(SASSDOC) --parse test/data/test.scss | diff - test/data/expected.json
	$(SASSDOC) --parse - < test/data/test.scss | diff - test/data/expected.stream.json
	rm -rf sassdoc && $(SASSDOC) test/data/test.scss && [ -d sassdoc ]
	rm -rf sassdoc && $(SASSDOC) - < test/data/test.scss && [ -d sassdoc ]

test/data/expected.stream.json: test/data/expected.json
	test/data/stream $< > $@

cover: dist
	rm -rf coverage
	istanbul cover --report none --print detail $(MOCHA) test/**/*.test.js

cover-browse: dist
	rm -rf coverage
	istanbul cover --report html $(MOCHA) test/**/*.test.js
	open coverage/index.html

travis: lint cover
	istanbul report lcovonly
	(cat coverage/lcov.info | coveralls) || exit 0
	rm -rf coverage

# Development
# ===========

develop:
	babel-node $(BABEL_FLAGS) $@

# Publish package to npm
# @see npm/npm#3059
# =======================

publish: all
	npm publish

# Release, publish
# ================

# "patch", "minor", "major", "prepatch",
# "preminor", "premajor", "prerelease"
VERS ?= "patch"
TAG  ?= "latest"

release: all
	npm version $(VERS) -m "Release %s"
	npm publish --tag $(TAG)
	git push --follow-tags

# Tools
# =====

rebuild:
	rm -rf node_modules
	npm install

.PHONY: dist test develop
.SILENT: dist develop cover view-cover travis
