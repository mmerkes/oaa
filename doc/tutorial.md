# Test Driven Development (TDD) of a NodeJS/ExpressJS REST API and Backbone App

In this tutorial we will lay out the steps to test a RESTful web service built
with [Node](http://nodejs.com), [Express](http://expressjs.com), and
[Grunt](http://gruntjs.com/). And, we put a BackboneJS Front-End app on top of it.

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
        files:['server.js', 'models/*.js'],
        tasks:['jshint', 'test']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'server.js', 'models/**/*.js', 'test/**/*.js'],
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
    watch: {
      all: {
        files:['server.js', '**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'server.js','models/**/*.js','routes/**/*.js' ],
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
      all: ['Gruntfile.js', 'server.js', 'models/**/*.js', 'test/**/*.js'],
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

## Set up Bower
`bower init`
defaults are ok

### Install Front-End Stuff
`bower install backbone jquery underscore`

If you do `tree app -L 2` you'll see where bower installed the front-end resources.

So, how do these front-end resources get into our app?

Enter Browserify
(link to keynote)

Install yet more grunt helpers
`npm install --save-dev grunt-contrib-copy grunt-contrib-clean grunt-browserify debowerify`

- copy - copies images, plain .css, and .html files
- clean - deletes a folder (like our dist folder)
- browserify - integrates grunt and browserify so we don't have to run browserify
  from the command line
- debowerify lets us use Bower to manage front-end assets, and also browserify to
use them as CommonJS modules. Boy, bet you can't you wait for native ES6 modules!

Start modifying your `Gruntfile.js` to include options for browserify

```javascript
'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-casper');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/server.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },

    copy: {
      all: {
        expand: true,
        cwd: 'public',
        src: ['/css/*.css', '*.html', '/images/**/*' ],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
      dev: {
        expand: true,
        cwd: 'public',
        src: ['/css/*.css', '*.html', '/images/**/*' ],
        dest: 'build/',
        flatten: true,
        filter: 'isFile'
      }
    },

    browserify: {
      prod: {
        src: ['public/js/*.js'],
        dest: 'dist/server.js',
        options: {
          transform: ['debowerify'],
          debug: false
        }
      },
      dev: {
        src: ['public/js/*.js'],
        dest: 'build/server.js',
        options: {
          transform: ['debowerify'],
          debug: true
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
    watch: {
      all: {
        files:['server.js', '**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'server.js','models/**/*.js','routes/**/*.js' ],
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
      all: ['Gruntfile.js', 'server.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    }
  });

  grunt.registerTask('build:dev',  ['clean:dev', 'browserify:dev', 'jshint:all', 'copy:dev']);
  grunt.registerTask('build:prod', ['clean:prod', 'browserify:prod', 'jshint:all', 'copy:prod']);
  grunt.registerTask('test', ['jshint', 'simplemocha:dev']);
  grunt.registerTask('server', [ 'jshint', 'express:dev','watch:express' ]);
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('default', ['jshint', 'test','watch:express']);

};

```

Create a `browser.js` file in your `assets/js` folder with:

```javascript
'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$      = $;

var AppView = Backbone.View.extend({
  initialize: function(){
  },

  render: function(){
    $('h1.largeHeader').replaceWith('<h1 class="largeHeader">FOO</h1>');
    console.log($('h1.largeHeader'));
    return this;
  }
});

var appView = new AppView();
appView.render();
````

## Copy in HTML and Image assets to public
### Hook up Sass

put ` grunt.loadNpmTasks('grunt-sass');` in your `Gruntfile.js`

Install Node Sass
`npm install grunt-sass --save-dev`

Modify your Gruntfile to include a sass task:
```javascript
sass: {
  dist: {
    files: {'build/css/styles.css': 'assets/scss/styles.scss'}
  },
  dev: {
    options: {
      includePaths: ['public/scss/'],
      sourceComments: 'map'
    },
    files: {'build/css/styles.css': 'assets/scss/styles.scss'}
  }
}
```

## Create a Seeds Build Task

You frequently need sample data to test with or use in development. This data is
called seed data.

We are going to use the
[grunt-mongoimport](https://www.npmjs.org/package/grunt-mongoimport) npm package.

`npm install grunt-mongoimport --save-dev`

add `grunt.loadNpmTasks(‘grunt-mongoimport’);` to your `Gruntfile.js`.

#### add seed files
in db/seeds/users.json etc...

add a grunt task:
```javascript
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
```

## Use Underscore Templates Based on a Script Tag in Index.

You can create templates and store small ones in index.html

```
<script type="text/x-underscore" id="userTemplate">
	<p class="full_name"><%= first_name %> <%= last_name %></p>
	<p class="email"><a href="mailto:<%= email %>"><%= email %></a></p>
</script>
```

Use jQuery to grab the template and compile it in your view render method.

```javascript
  render: function() {
    var attributes = this.model.toJSON();
    var template = _.template( $('script#userTemplate' ).html() );
    this.$el.html(template(attributes));
  }
```

## Use Handlebars for templating with Backbone, Browserify, and Grunt

`npm install hbsfy --save-dev`

More info at:
https://github.com/epeli/node-hbsfy

_Bower or NPM?_ Well, hbsify already installed handlebars via npm, so we're all
set. Debate over.

Add in the __hbsify__ transform to browserify in your `Gruntfile.js`

```javascript

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
}
```

#### Create a folder for templates

`mkdir -p app/assets/templates`

And a file to store the handlebars template:

`touch app/assets/templates/user.hbs`

edit `user.hbs` (in your favorite editor) to include:

```html
<p class="full_name">{{ first_name }} {{ last_name }}</p>
<p class="email"><a href="mailto:{{ email }}">{{ email }}</a></p>
```

Change the UserView.js render method to load the template:

```javascript
render: function() {
  var userAttributes = this.model.toJSON();
  var template = require('../../templates/user.hbs');
  this.$el.html(template(userAttributes));
  return this;
}
```
