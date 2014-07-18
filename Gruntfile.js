'use strict';


module.exports = function (grunt) {

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);

  // Project specific paths.
  var dirs = {
    cwd: __dirname,
    scss: 'view/scss',
    css: 'view/assets/css',
    js: 'view/assets/js',
    tpl: 'view/templates',
    dist: 'examples/dist',
    src: 'src',
    test: 'src/annotation/annotations/test'
  };

  grunt.initConfig({

    // Load package Object.
    // pkg: grunt.file.readJSON('package.json'),

    dirs: dirs,

    sass: {
      options: {
        style: 'compressed'
      },
      dist: {
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
        src: ['<%= dirs.test %>/*.js']
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
        tasks: ['sass:dist', 'autoprefixer:dist', 'dumpCSS']
      },
      js: {
        files: ['<%= dirs.js %>/**/*.js'],
        tasks: ['dumpJS']
      },
      tpl: {
        files: ['<%= dirs.tpl %>/**/*.swig'],
        tasks: ['compile']
      }
    },

    browserSync: {
      dist: {
        bsFiles: {
          src: [
            '<%= dirs.dist %>/*.html',
            '<%= dirs.dist %>/**/*.css',
            '<%= dirs.dist %>/**/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: '<%= dirs.dist %>'
          }
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', '> 1%', 'ie 9']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dirs.css %>',
          src: '{,*/}*.css',
          dest: '<%= dirs.css %>'
        }]
      }
    }

  });


  // A custom task to compile through SassDoc cli.
  grunt.registerTask('compile', 'Generates documentation', function () {
    var sassdoc = require('./src/api');

    var config = {
      display: {
        access: ['public', 'private'],
        alias: false,
        watermark: true
      },

      package: './package.json'
    };

    sassdoc.logger.enabled = true; // verbose

    sassdoc.documentize(dirs.scss, dirs.dist, config).then(this.async());
  });

  grunt.registerTask('dumpJS', 'Dump JS to dist', function () {
    var sdfs = require('./src/file');
    var chalk = require('chalk');

    var done = this.async();
    var src = dirs.js;
    var dest = dirs.dist + '/assets/js';

    sdfs.folder.copy(src, dest)
      .then(function () {
        grunt.log.writeln('JS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });

  // Make the Sass dist action faster
  // by not requiring a full `compile`.
  grunt.registerTask('dumpCSS', 'Dump CSS to dist', function () {
    var sdfs = require('./src/file');
    var chalk = require('chalk');

    var done = this.async();
    var src = dirs.css;
    var dest = dirs.dist + '/assets/css';

    sdfs.folder.copy(src, dest)
      .then(function () {
        grunt.log.writeln('CSS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });


  // While working on the view/examples.
  grunt.registerTask('dist', [
    'browserSync:dist',
    'watch'
  ]);


  // Before push and for travis.
  grunt.registerTask('test', [
    'jshint:all',
    'mochaTest'
  ]);


  // All together.
  grunt.registerTask('default', [
    // @todo: define needs.
  ]);

};
