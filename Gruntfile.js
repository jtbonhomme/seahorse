module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // custom variables configuration
    dirs: {
      lib:     'lib/',
      bin:     'bin/',
      tmp:     'tmp/',
      vendor:  'vendor/',
      specs:   'specs/'
    },

    files: {
      all:      '**/*',
      seahorse: 'seahorse.js',
      js:       '**/*.js'
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: '<%= dirs.bin %><%= files.seahorse %>',
        options: {
          args: ["example.json"],
          watch: ['bin', 'lib', 'specs'],
          verbose: true,
          env: {
            DEBUG: 'express:*'
          }
        }
      }
    },

    // contrib-watch plugin configuration.
    watch: {
      jshint: {
        files: ['<%= dirs.lib %><%= files.js %>', '<%= dirs.specs %><%= files.js %>', 'Gruntfile.js'],
        tasks: 'jshint'
      }
    },

    // contrib-clean plugin configuration.
    clean: {
      all: [
        '<%= dirs.tmp %>',
        '<%= dirs.vendor %><%= files.js %>'
      ], tmp: [
        '<%= dirs.tmp %>'
      ]
    },

    // contrib-jshint plugin configuration.
    jshint: {
      files: [
        'Gruntfile.js',
        '<%= dirs.lib %><%= files.js %>'
      ],
      options: {
      }
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      test: {
        src: ['<%= dirs.lib %>help.js', '<%= dirs.lib %>utils.js', '<%= dirs.lib %>routes.js', '<%= dirs.lib %>server.js', '<%= dirs.specs %>specs.js', '<%= dirs.specs %>routes.js', '<%= dirs.specs %>server.js', '<%= dirs.specs %>seahorse.js'],
        dest: '<%= dirs.tmp %><%= pkg.name %>.js',
      },
      dist: {
        src: ['<%= dirs.lib %>help.js', '<%= dirs.lib %>utils.js', '<%= dirs.lib %>routes.js', '<%= dirs.lib %>server.js', '<%= dirs.lib %>main.js'],
        dest: '<%= dirs.vendor %><%= pkg.name %>.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['<%= dirs.tmp %>seahorse.js']
      }
    }
  });

  // Load the plugin that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('build', ['clean:all', 'jshint', 'concat:test', 'mochaTest:test', 'concat:dist']);
  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('test', ['clean:tmp', 'jshint', 'concat:test', 'mochaTest:test']);
  grunt.registerTask('default', ['test']);

};
