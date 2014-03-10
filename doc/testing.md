# Testing a NodeJS/ExpressJS REST API

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

### Write our first test for users

Install Chai and Supertest
`npm install chai supertest --save-dev`
