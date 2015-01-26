PATH := node_modules/.bin:$(PATH)
SASSDOC = bin/sassdoc
MOCHA = node_modules/.bin/_mocha
TO5_FLAGS = --experimental

all: dist lint test

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist:
	rm -rf $@
	6to5 $(TO5_FLAGS) src --out-dir $@

# Code quality
# ============

lint: .jshintrc
	jshint bin/sassdoc index.js src test

test: test/data/expected.stream.json dist
	mocha test/annotations/*.test.js
	mocha test/env/*.test.js test/utils/*.test.js
	rm -rf sassdoc && mocha test/api/*.test.js
	$(SASSDOC) --parse test/data/test.scss | diff - test/data/expected.json
	$(SASSDOC) --parse < test/data/test.scss | diff - test/data/expected.stream.json
	rm -rf sassdoc && $(SASSDOC) test/data/test.scss && [ -d sassdoc ]
	rm -rf sassdoc && $(SASSDOC) < test/data/test.scss && [ -d sassdoc ]

test/data/expected.stream.json: test/data/expected.json
	test/data/stream $< > $@

.jshintrc: .jshintrc.yaml
	js-yaml $< > $@

cover: dist
	rm -rf coverage
	istanbul cover --report none --print detail $(MOCHA) test/**/*.test.js

cover-browse: dist
	rm -rf coverage
	istanbul cover --report html $(MOCHA) test/**/*.test.js
	open coverage/index.html

travis: cover
	istanbul report lcovonly
	(cat coverage/lcov.info | coveralls) || exit 0
	rm -rf coverage

# Development
# ===========

develop:
	6to5-node $(TO5_FLAGS) $@

# Publish package to npm
# @see npm/npm#3059
# =======================

publish: all
	npm publish --tag beta

# Release, publish
# ================

# "patch", "minor", "major", "prepatch",
# "preminor", "premajor", "prerelease"
VERS ?= "patch"

release: all
	npm version $(VERS) -m "Release %s"
	npm publish
	git push --follow-tags

# Tools
# =====

rebuild:
	rm -rf node_modules
	npm install

.PHONY: dist test develop
.SILENT: dist develop cover view-cover foo travis
