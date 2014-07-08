'use strict';

module.exports = function (grunt) {

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);

  // Require SassDoc file utils.
  var sdfs = require('./src/file');

  // Project specific paths.
  var dirs = {
    cwd: '.',
    base: 'examples/dist', // Server base.
    dist: 'examples/dist',
    scss: 'view/scss',
    css: 'view/assets/css',
    tpl: 'view/templates',
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
      view: {
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
        tasks: ['sass:view']
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
            baseDir: '<%= dirs.base %>'
          }
        }
      }
    }

  });


  // A custom task to compile through SassDoc cli.
  grunt.registerTask('compile', 'Generates documentation', function () {
    var done = this.async();

    grunt.util.spawn({
      cmd: 'bin/sassdoc',
      args: ['view/scss/utils', 'examples/dist', '--verbose']
    },

    function (error, result) {
      if (error) {
        grunt.log.error(error);
      }

      if (result) {
        grunt.log.writeln(result);
      }

      done();
    });
  });

  // Make the Sass dist action faster
  // by not requiring a full `compile`.
  grunt.event.on('watch', function (action, filepath, target) {
    if (target === 'scss' && action === 'changed') {
      sdfs.dumpAssets(dirs.dist);
    }
  });

  // While working on the view.
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
