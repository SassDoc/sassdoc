'use strict';

var path = require('path');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var fs = require('fs');
var fse = require('fs-extra');
var q = require('q');
var sassdoc = require('./src/api');

var copy = q.denodeify(fse.copy);

// Set development theme.
var themePath = process.env.SASSDOC_THEME || './node_modules/sassdoc-theme-default';

// Theme path helper.
var theme = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(themePath);
  return path.join.apply(path, args);
};

// Project specific paths.
var dirs = {
  scss: theme('scss'),
  css: theme('assets/css'),
  js: theme('assets/js'),
  tpl: theme('views'),
  develop: 'develop',
  docs: 'develop/docs',
  src: 'src',
  test: 'test'
};

// Tasks configs.
var config = {

  dirs: dirs,

  sass: {
    options: {
      style: 'compressed'
    },
    develop: {
      files: [{
        expand: true,
        cwd: '<%= dirs.scss %>',
        src: ['*.scss'],
        dest: '<%= dirs.css %>',
        ext: '.css'
      }]
    }
  },

  mochaTest: {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['<%= dirs.test %>/**/*.test.js']
    }
  },

  jshint: {
    options: {
      jshintrc: '.jshintrc'
    },
    all: [
      'Gruntfile.js',
      '<%= dirs.src %>/**/*.js'
    ]
  },

  watch: {
    scss: {
      files: ['<%= dirs.scss %>/**/*.scss'],
      tasks: ['sass:develop', 'autoprefixer:develop', 'dumpCSS']
    },
    js: {
      files: ['<%= dirs.js %>/**/*.js'],
      tasks: ['dumpJS']
    },
    tpl: {
      files: ['<%= dirs.tpl %>/**/*.swig'],
      tasks: ['compile:develop']
    }
  },

  browserSync: {
    options: {
      watchTask: true,
      server: {
        baseDir: '<%= dirs.docs %>'
      }
    },
    develop: {
      bsFiles: {
        src: [
          '<%= dirs.docs %>/*.html',
          '<%= dirs.docs %>/**/*.css',
          '<%= dirs.docs %>/**/*.js'
        ]
      }
    }
  },

  autoprefixer: {
    options: {
      browsers: ['last 2 version', '> 1%', 'ie 9']
    },
    develop: {
      files: [{
        expand: true,
        cwd: '<%= dirs.css %>',
        src: '{,*/}*.css',
        dest: '<%= dirs.css %>'
      }]
    }
  },

  clean: {
    empty: [
      '<%= dirs.develop %>/empty',
      '<%= dirs.develop %>/docs-empty'
    ]
  },

  // SassDoc compilation (documentize).
  compile: {
    options: {
      'basePath': 'http://github.com/sassdoc/sassdoc-theme-light/tree/master/scss',
      'package': theme('package.json'),
      'theme': process.env.SASSDOC_THEME || 'sassdoc-theme-default',
      'force': true,
      'groups': {
        'undefined': 'General',
        'cross-browser-support': 'Cross Browser Support'
      }
    },
    develop: {
      src: '<%= dirs.scss %>',
      dest: '<%= dirs.docs %>',
    },
    empty: {
      src: '<%= dirs.develop %>/empty',
      dest: '<%= dirs.develop %>/docs-empty',
    }
  }

};


module.exports = function (grunt) {

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);


  grunt.initConfig(config);


  // A custom task to compile through SassDoc API.
  grunt.registerMultiTask('compile', 'Generates documentation', function () {
    var done = this.async();
    var config = this.options({});

    // Visualy check for empty docs behavior.
    if (this.target === 'empty') {
      mkdirp.sync('develop/empty');
    }

    // Enable verbose.
    sassdoc.logger.enabled = true;

    var src = this.filesSrc[0];
    var dest = this.files[0].dest;

    sassdoc
      .documentize(src, dest, config)
      .then(done)
      .catch(function (err) {
        grunt.log.error(err);
        grunt.fail.warn('SassDoc documentation failed.');
      });
  });


  // Dump js files from theme into `develop` whenever they get modified.
  // Prevent requiring a full `compile`.
  grunt.registerTask('dumpJS', 'Dump JS to develop', function () {
    var done = this.async();
    var src = dirs.js;
    var dest = path.join(dirs.docs, 'assets/js');

    copy(src, dest)
      .then(function () {
        grunt.log.writeln('JS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });


  // Dump CSS files from theme into `develop` whenever they get modified.
  // Prevent requiring a full `compile`.
  grunt.registerTask('dumpCSS', 'Dump CSS to develop', function () {
    var done = this.async();
    var src = dirs.css;
    var dest = path.join(dirs.docs, 'assets/css');

    copy(src, dest)
      .then(function () {
        grunt.log.writeln('CSS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });


  // Development task.
  // While working on a theme.
  grunt.registerTask('develop', 'Development task', function () {
    var tasks = ['browserSync:develop', 'watch'];
    var docs = fs.existsSync(dirs.docs);

    if (!docs) {
      grunt.log.writeln('Running initial compile: ' + chalk.cyan(dirs.docs) + '.');
      tasks.unshift('compile:develop');
    }

    grunt.task.run(tasks);
  });


  // Linting and unit tests task.
  // Before push and for travis.
  grunt.registerTask('test', [
    'jshint:all',
    'mochaTest'
  ]);

};
