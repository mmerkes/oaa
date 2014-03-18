'use strict';

process.env.PHANTOMJS_EXECUTABLE = process.env.PHANTOMJS_EXECUTABLE || '/usr/local/opt/nvm/v0.10.26/bin/phantomjs';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/**/*']
      },
      prod: ['dist']
    },

    copy: {
      prod: {
        expand: true,
        cwd: 'app/assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'dist/',
        flatten: false,
        filter: 'isFile'
      },
      dev: {
        expand: true,
        cwd: 'app/assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'build/',
        flatten: false,
        filter: 'isFile'
      }
    },

    browserify: {
      prod: {
        src: ['app/assets/js/*.js'],
        dest: 'dist/browser.js',
        options: {
          transform: ['debowerify','hbsfy'],
          debug: false
        }
      },
      dev: {
        src: ['app/assets/js/*.js'],
        dest: 'build/browser.js',
        options: {
          transform: ['debowerify','hbsfy'],
          debug: true
        }
      }
    },

    notify: {
      server: {
        options: {
          message: 'Server is ready'
        }
      },
      express: {
        options: {
          message: 'express is ready'
        }
      },
      watch: {
        options: {
          message: 'watch'
        }
      }
    },

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    simplemocha: {
      dev:{
        src:['test/*_test.js','!test/acceptance/*_test.js'],
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },

    mochacov: {
      coverage: {
        options: {
          reporter: 'mocha-term-cov-reporter',
          coverage: true
        }
      },
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      unit: {
        options: {
          reporter: 'spec',
          require: ['chai']
        }
      },
      html: {
        options: {
          reporter: 'html-cov',
          require: ['chai']
        }
      },
      options: {
        files: 'test/*.js',
        ui: 'bdd',
        colors: true
      }
    },

    watch: {
      all: {
        files:['server.js', './**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'server.js','api/**/*','app/assets/**/*' ],
        tasks:  [ 'clean', 'copy', 'sass:dev', 'browserify:dev', 'express:dev' ],
        options: {
          // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
          // Without this option specified express won't be reloaded
          spawn: false
        }
      }
    },
    casper: {
      acceptance : {
        options : {
          test : true,
          //'log-level': 'debug'
        },
        files : {
          'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'server.js', 'api/**/*.js', 'app/assets**/*.js'],
      options: {
        jshintrc: true
      }
    },
    sass: {
      dist: {
        files: {'build/css/styles.css': 'app/assets/scss/styles.scss'}
      },
      dev: {
        options: {
          includePaths: ['app/assets/scss/'],
          sourceComments: 'map'
        },
        files: {'build/css/styles.css': 'app/assets/scss/styles.scss'}
      }
    },
    mongoimport: {
      options: {
        db : 'oaa',
        //optional
        //host : 'localhost',
        //port: '27017',
        //username : 'username',
        //password : 'password',
        //stopOnError : false,
        collections : [
          {
            name : 'users',
            type : 'json',
            file : 'db/seeds/users.json',
            jsonArray : true,  //optional
            upsert : true,  //optional
            drop : true  //optional
          },
          {
            name : 'meetings',
            type :'json',
            file : 'db/seeds/meetings.json',
            jsonArray : true,
            upsert : true,
            drop : true
          }
        ]
      }
    }
  });

  grunt.registerTask('build:dev',  ['clean:dev', 'sass:dev', 'browserify:dev', 'jshint:all', 'copy:dev']);
  grunt.registerTask('build:prod', ['clean:prod', 'browserify:prod', 'jshint:all', 'copy:prod']);
  grunt.registerTask('test', ['jshint', 'mochacov:test' ]);
  grunt.registerTask('travis', ['jshint', 'mochacov:unit', 'mochacov:coverage', 'mochacov:coveralls']);
  grunt.registerTask('server', [ 'build:dev', 'express:dev', 'watch:express','notify' ]);
  grunt.registerTask('test:acceptance',['build:dev', 'express:dev', 'casper']);
  grunt.registerTask('default', ['jshint', 'test','watch:express']);

};
