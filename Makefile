YAML = node_modules/js-yaml/bin/js-yaml.js
JSHINT = node_modules/jshint/bin/jshint

all: lint

lint: .jshintrc
	$(JSHINT) bin/sassdoc index.js src test

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@
