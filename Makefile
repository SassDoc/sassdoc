TRACEUR = node_modules/traceur/traceur
JSHINT = node_modules/jshint/bin/jshint
MOCHA = node_modules/mocha/bin/mocha
YAML = node_modules/js-yaml/bin/js-yaml.js

all: dist lint test

# Compile ES6 from `src` to ES5 in `dist`
# =======================================

dist: force
	$(TRACEUR) --modules=commonjs --dir src dist

# Code quality
# ============

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

test: force
	$(MOCHA) test/annotations/*.test.js
	test/data/dump | diff - test/data/expected.json

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

force:
