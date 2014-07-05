lint:
		./node_modules/jshint/bin/jshint ./src/

compile:
		bin/sassdoc examples/stylesheets examples/dist --verbose

scss:
		sass --update view/scss:view/assets/css --style compressed

watch: 
		sass --watch view/scss:view/assets/css --style compressed

test: lint scss compile