TO5 = node_modules/6to5/bin/6to5/index.js
TO5_NODE = node_modules/6to5/bin/6to5-node
TO5_FLAGS = --experimental

JSHINT = node_modules/jshint/bin/jshint
MOCHA = node_modules/mocha/bin/mocha
YAML = node_modules/js-yaml/bin/js-yaml.js
SASSDOC = bin/sassdoc

all: dist lint test

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist: force
	rm -rf $@
	$(TO5) $(TO5_FLAGS) src --out-dir dist

# Code quality
# ============

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

test: test/data/expected.stream.json force dist
	$(MOCHA) test/annotations/*.test.js
	rm -rf sassdoc && $(MOCHA) test/api/*.test.js
	$(SASSDOC) --parse test/data/test.scss | diff - test/data/expected.json
	$(SASSDOC) --parse < test/data/test.scss | diff - test/data/expected.stream.json
	rm -rf sassdoc && $(SASSDOC) test/data/test.scss && [ -d sassdoc ]
	rm -rf sassdoc && $(SASSDOC) < test/data/test.scss && [ -d sassdoc ]

test/data/expected.stream.json: test/data/expected.json
	test/data/stream $< > $@

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

develop: force
	$(TO5_NODE) $(TO5_FLAGS) $@

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

force:
