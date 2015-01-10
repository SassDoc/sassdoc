TO5 = node_modules/6to5/bin/6to5/index.js
JSHINT = node_modules/jshint/bin/jshint
MOCHA = node_modules/mocha/bin/mocha
YAML = node_modules/js-yaml/bin/js-yaml.js

DEVELOP = develop
SASSDOC = bin/sassdoc
SAMPLE = node_modules/sassdoc-theme-default/scss

all: dist lint test

# Publish package to npm
# @see npm/npm#3059
# =======================

publish: all
	npm publish --tag beta

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist: force
	rm -rf $@
	$(TO5) --experimental src --out-dir dist

# Code quality
# ============

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

test: test/data/expected.stream.json force dist
	$(MOCHA) test/annotations/*.test.js
	$(SASSDOC) --parse test/data/test.scss | diff - test/data/expected.json
	$(SASSDOC) --parse < test/data/test.scss | diff - test/data/expected.stream.json
	rm -rf sassdoc && $(SASSDOC) test/data/test.scss && [ -d sassdoc ]
	rm -rf .sassdoc && $(SASSDOC) < test/data/test.scss && [ -d sassdoc ]

test/data/expected.stream.json: test/data/expected.json
	test/data/stream $< > $@

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

# Compile sample input in `develop`
# =================================

compile: develop

develop: force
	$(SASSDOC) $(SAMPLE) $@ -f

force:
