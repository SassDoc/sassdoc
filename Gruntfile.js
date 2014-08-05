'use strict';

var path = require('path');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var fs = require('fs');
var sassdoc = require('./src/api');
var sdfs = require('./src/file');

// Set development theme.
var themePath = 'node_modules/sassdoc-theme-default/node_modules/sassdoc-theme-light';

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

module.exports = function (grunt) {

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);

  grunt.initConfig({

    // Load package Object.
    // pkg: grunt.file.readJSON('package.json'),

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
      develop: {
        bsFiles: {
          src: [
            '<%= dirs.docs %>/*.html',
            '<%= dirs.docs %>/**/*.css',
            '<%= dirs.docs %>/**/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: '<%= dirs.docs %>'
          }
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

    compile: {
      develop: {
        src: '<%= dirs.scss %>',
        dest: '<%= dirs.docs %>',
      },
      empty: {
        src: '<%= dirs.develop %>/empty',
        dest: '<%= dirs.develop %>/docs-empty',
      }
    },

    clean: {
      empty: [
        '<%= dirs.develop %>/empty',
        '<%= dirs.develop %>/docs-empty'
      ]
    }

  });


  // A custom task to compile through SassDoc API.
  grunt.registerMultiTask('compile', 'Generates documentation', function (src, dest) {
    var done = this.async();

    // Use this to override the theme default config.
    var config = {
      'basePath': 'http://github.com/sassdoc/sassdoc-theme-light/tree/master/scss',
      'package': theme('package.json'),
      'theme': 'sassdoc-theme-default',
      'groups': {
        'undefined': 'General'
      }
    };

    // Enable verbose.
    sassdoc.logger.enabled = true;

    // Visualy check for empty docs behavior.
    if (this.target === 'empty') {
      mkdirp.sync('develop/empty');
    }

    src = src || this.filesSrc[0];
    dest = dest || this.files[0].dest;

    sassdoc
      .documentize(src, dest, config)
      .then(done);
  });


  // Dump js files from theme into `develop` whenever they get modified.
  // Prevent requiring a full `compile`.
  grunt.registerTask('dumpJS', 'Dump JS to develop', function () {
    var done = this.async();
    var src = dirs.js;
    var dest = path.join(dirs.docs, 'assets/js');

    sdfs.folder.copy(src, dest)
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

    sdfs.folder.copy(src, dest)
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
