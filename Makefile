BIN = $(PWD)/node_modules/.bin/
SASSDOC = $(PWD)/bin/sassdoc

all: dist lint test

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist:
	rm -rf $@
	$(BIN)babel src --out-dir $@

# Code quality
# ============

lint: .jshintrc
	$(BIN)jshint --verbose bin/sassdoc index.js src test

.jshintrc: .jshintrc.yaml
	$(BIN)js-yaml $< > $@

test: test/data/expected.stream.json dist
	$(BIN)_mocha test/**/*.test.js
	$(SASSDOC) --parse test/data/test.scss | diff - test/data/expected.json
	$(SASSDOC) --parse - < test/data/test.scss | diff - test/data/expected.stream.json
	rm -rf sassdoc && $(SASSDOC) test/data/test.scss && [ -d sassdoc ]
	rm -rf sassdoc && $(SASSDOC) - < test/data/test.scss && [ -d sassdoc ]

test/data/expected.stream.json: test/data/expected.json
	test/data/stream $< > $@

cover: dist
	rm -rf coverage
	$(BIN)istanbul cover --report none --print detail $(BIN)_mocha test/**/*.test.js

cover-browse: dist
	rm -rf coverage
	$(BIN)istanbul cover --report html $(BIN)_mocha test/**/*.test.js
	open coverage/index.html

travis: lint cover
	$(BIN)istanbul report lcovonly
	(cat coverage/lcov.info | coveralls) || exit 0
	rm -rf coverage

# Development
# ===========

develop:
	$(BIN)babel-node $@

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
