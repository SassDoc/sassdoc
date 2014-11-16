YAML = node_modules/js-yaml/bin/js-yaml.js
JSHINT = node_modules/jshint/bin/jshint
TRACEUR = node_modules/traceur/traceur

all: dist lint

dist: force
	$(TRACEUR) --modules=commonjs --dir src dist

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

force:
