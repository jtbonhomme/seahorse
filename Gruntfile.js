module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // custom variables configuration
    dirs: {
      lib:     'lib/',
      test:    'specs/'
    },

    files: {
      all: '**/*',
      js:  '**/*.js'
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
        script: 'bin/seahorse',
        options: {
          args: ["example.json"],
          nodeArgs: ['--debug']
        }
      }
    },

    // contrib-watch plugin configuration.
    watch: {
      jshint: {
        files: ['<%= dirs.lib %><%= files.js %>', '<%= dirs.test %><%= files.js %>', 'Gruntfile.js'],
        tasks: 'jshint'
      }
    },

    // contrib-clean plugin configuration.
    clean: {
      all: [
        'public'
      ]
    },

    // contrib-jshint plugin configuration.
    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js'
      ],
      options: {
      }
    }
  });

  // Load the plugin that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  // Default task(s).
  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('default', ['clean:all', 'jshint']);

};
