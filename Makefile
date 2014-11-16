TRACEUR = node_modules/traceur/traceur
JSHINT = node_modules/jshint/bin/jshint
MOCHA = node_modules/mocha/bin/mocha
YAML = node_modules/js-yaml/bin/js-yaml.js
WEBSHOT = node_modules/webshot-cli/webshot

DEVELOP = develop
SASSDOC = bin/sassdoc
SAMPLE = node_modules/sassdoc-theme-default/scss

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

.jshintrc: .jshintrc.yaml
	$(YAML) $< > $@

# Screenshot
# ==========

shot: screenshot.png

screenshot.png: $(DEVELOP) $(WEBSHOT)
	$(WEBSHOT) --shot-size=1200/675 $</index.html $@

$(DEVELOP): force
	$(SASSDOC) $(SAMPLE) $@ -f

$(WEBSHOT):
	npm install webshot-cli

force:
