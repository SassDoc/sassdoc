YAML = node_modules/js-yaml/bin/js-yaml.js
JSHINT = node_modules/jshint/bin/jshint
TRACEUR = node_modules/traceur/traceur
MOCHA = node_modules/mocha/bin/mocha

all: dist lint test

dist: force
	$(TRACEUR) --modules=commonjs --dir src dist

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

test: force
	$(MOCHA) test/annotations/*.test.js

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

force:
