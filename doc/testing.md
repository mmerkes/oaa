# Test Driven Development (TDD) of a NodeJS/ExpressJS REST API and Backbone App

In this tutorial we will lay out the steps to test a RESTful web service built
with [Node](http://nodejs.com), [Express](http://expressjs.com), and
[Grunt](http://gruntjs.com/).

## Setup
Set up your package.json to track dependencies:
`npm init`

Install modules that integrate grunt and mocha, jshint and watch for changes.
`npm install grunt-simple-mocha grunt-contrib-watch grunt-contrib-jshint --save-dev`

Create `Gruntfile.js` to load the modules and set task options.

```javascript
//Gruntfile.js
'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    simplemocha:{
      dev:{
        src:'test/test.js',
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },
    watch:{
      all:{
        files:['app.js', 'models/*.js'],
        tasks:['jshint', 'test']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    }
  });

  grunt.registerTask('test', 'simplemocha:dev');
  grunt.registerTask('watch', 'test, watch:all');

};

```

Here is my `.jshintrc`

```
{
  // Details: https://github.com/victorporof/Sublime-JSHint#using-your-own-jshintrc-options
  // Example: https://github.com/jshint/jshint/blob/master/examples/.jshintrc
  // Documentation: http://www.jshint.com/docs/
  "browser": true,
  "esnext": true,
  "globals": {
    // MOCHA and CHAI
    "describe"   : false,
    "it"         : false,
    "to"         : false,
    "ok"         : false,
    "be"         : false,
    "before"     : false,
    "beforeEach" : false,
    "after"      : false,
    "afterEach"  : false,
    "equal"      : false
  },
  "globalstrict": true,
  "quotmark": true,
  "smarttabs": true,
  "trailing": true,
  "undef": true,
  "unused": true,
  "indent": 2,
  "node": true
}
```

Copy this `test/utils.js` to set up some utility functions to deal with Mongoose
better.

```javascript
//test/utils.js
'use strict';

/*
* From: http://www.scotchmedia.com/tutorials/express/authentication/2/02
* Modified from https://github.com/elliotf/mocha-mongoose
*/

var config = require('../config');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

beforeEach(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return done();
  }

  function reconnect() {
    mongoose.connect(config.db.test, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  }

  function checkState() {
    switch (mongoose.connection.readyState) {
    case 0:
      reconnect();
      break;
    case 1:
      clearDB();
      break;
    default:
      process.nextTick(checkState);
    }
  }

  checkState();
});

afterEach(function (done) {
  mongoose.disconnect();
  return done();
});

```

## Write our tests for users

Install Chai and Supertest
`npm install chai supertest --save-dev`

```javascript
// tests/user_json_api_test.js

'use strict';
//jshint unused:false

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../app').app;

describe('Users JSON api', function(){
  var id;

  it('can create a new user', function(done){
    superagent.post('http://localhost:3000/api/v1/users')
      .send({first_name: 'Ford', last_name: 'Prefect'})
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body._id).to.not.be.eql(null);
        expect(res.body.first_name).to.be.eql('Ford');
        expect(res.body.last_name).to.be.eql('Prefect');
        id = res.body._id;

        done();
      });
  });

  it('can get users collection', function(done){
    superagent.get('http://localhost:3000/api/v1/users').end(function(e, res){
      expect(e).to.eql(null);
      expect(res.body.length).to.be.above(0);

      done();
    });
  });

  it('can get a single user', function(done){
    superagent.get('http://localhost:3000/api/v1/users/' + id).end(function(e, res){
      expect(e).to.eql(null);
      expect(res.body._id).to.be.eql(id);
      expect(res.body.first_name).to.be.eql('Ford');
      expect(res.body.last_name).to.be.eql('Prefect');

      done();
    });
  });

  it('can update a user', function(done){
    superagent.put('http://localhost:3000/api/v1/users/' + id).send({first_name: 'Arthur', last_name: 'Dent'})
    .end(function(e,res){
      expect(e).to.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });

  it('can delete a user' , function(done){
    superagent.del('http://localhost:3000/api/v1/users/' + id).end(function(e,res){
      expect(e).to.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });
});

```

## Write our first acceptance test

To write our acceptance test we'll need to make sure to start the server.

#### Hook up Grunt-Express-Server

From the command line:
`npm install grunt-express-server --save-dev`

And in Gruntfile.js add:
`grunt.loadNpmTasks('grunt-express-server');`

#### Install and Configure CasperJS and PhantomJS

Install Casper and PhantomJS globally, and Grunt integration locally

```
npm install -g phantomjs casperjs
npm install grunt-casper --save-dev
```

Edit your `Gruntfile.js` to look like this:

```javascript
'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-casper');

  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js'
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app.js'
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
    watch: {
      all: {
        files:['app.js', '**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'app.js','models/**/*.js','routes/**/*.js' ],
        tasks:  [ 'express:dev' ],
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
        },
        files : {
          'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'simplemocha:dev']);
  grunt.registerTask('server', [ 'jshint', 'express:dev','watch:express' ]);
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('default', ['jshint', 'test','watch:express']);

};

```

I've re-organied the tasks a bit above, and added a `test:acceptance` task that
sets up the express server in dev mode, and then runs the casper tests.

### Set up Bower
`bower init`
defaults are ok

### Install Front-End Stuff
`bower install backbone jquery underscore`

If you do `tree app -L 2` you'll see where bower installed the front-end resources.

So, how do these front-end resources get into our app?

Enter Browserify
(link to keynote)

Install yet more grunt helpers
`npm install --save-dev grunt-contrib-copy grunt-contrib-clean grunt-browserify`

- copy - copies images, plain .css, and .html files
- clean - deletes a folder (like our dist folder)
- browserify - integrates grunt and browserify so we don't have to run browserify
  from the command line

`npm install debowerify --save`

Start modifying your `Gruntfile.js` to include options for browserify

```javascript
 pkg: grunt.file.readJSON('package.json'),

    clean: ['dist'],

    copy: {
      all: {
        expand: true,
        cwd: 'src/',
        src: ['*.css', '*.html', '/images/**/*', '!Gruntfile.js'],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
    },

    browserify: {
      all: {
        src: 'src/*.js',
        dest: 'dist/app.js'
      },
      options: {
        transform: ['debowerify'],
        debug: true
      }
    },

```
