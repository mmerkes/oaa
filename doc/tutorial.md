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

## Continuous Integration

Now that your tests are running, it's time to automate them every time you push
to GitHub. When your tests pass on your feature branch, GitHub +
[TravisCI](http://travis-ci.org) can give you the go ahead and merge them into
the master branch. This is how open source [continuous integration](http://en.wikipedia.org/wiki/Continuous_integration)
works. [TravisCI](http://travis-ci.org) is free for open source projects, and as
its name signifies, is a
[continuous integration](http://blog.teamtreehouse.com/use-continuous-integration-continuous-deployment)
server.

An additional bonus is that setting up Travis, although at times difficult, is a
great first step to getting a real production environment spec'd out. Knowing all
the dependencies needed to set up Travis automatically will help you when you're
building your deployment server automatically, too.

Travis uses a '.travis.yml' file for configuration. Check out the
[online docs](http://docs.travis-ci.com/user/languages/javascript-with-nodejs/)
for getting started with JavaScript/Node projects.

edit `.travis.yml`

```yaml
language: node_js
node_js:
- '0.10'
services: mongodb
before_install:
- npm install -g grunt-cli
- npm install -g bower
install:
- npm install
- bower install
before_script:
- grunt mongoimport
- grunt build:dev
env:
  global:
    secure: SET_YOUR_OWN_COVERALLS_KEY_HERE_WITH_TRAVIS_GEM
```

You also need to add a section to your `package.json` to let travis run the
`npm test` command:

```json
"scripts": {
  "test": "mkdir -p build && grunt travis --trace --verbose"
},
```

We need to tell Travis that we are going to use their shared mongodb server. We
need Travis to install grunt-cli and bower before even installing the dependencies
from our project. We also need to tell Travis to load our database seeds, and
then build the app. You can also set secure environment variables, which we will
get to in a while later when discussing code coverage.

Since you have a working ruby installed, it's easy to get a helpful tool for
Travis installed. `gem install travis`
You'll want to check out the brief help: `help travis` . The travis gem is also
how you will end up encrypting any environment keys needed on TravisCI.

## Code Coverage

Code coverage is a measurement of how much code your tests have actually executed.
The code coverage tools I have used are [Blanket.js](http://blanketjs.org/) and
[Coveralls.io](http://coveralls.io/)

Go ahead and sign up for [Coveralls.io](http://coveralls.io/) with your GitHub
account.

BlanketJS is available as a [stand-alone tool](http://blanketjs.org) but it's easy
to integrate it with our Grunt build with a couple of npm packages:

`npm install grunt-mocha-cov mocha-term-cov-reporter --save-dev`

Put a new section into our `Gruntfile.js` for the
[mochacov](https://github.com/mmoulton/grunt-mocha-cov)
and [mocha-term-cov-reporter](https://github.com/jakobmattsson/mocha-term-cov-reporter)
combo. Don't forget to check out the README's in the links above.

```javascript
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
```

## Gemnasium

Gemnasium monitors your project dependencies and alerts you about updates and
security vulnerabilities.

Check out [Our Gemnasium report](https://gemnasium.com/codefellows/oaa), and get
it running for your project according to their instructions.
Add their badge to your project README.

## Complexity

### Reading
Read chapter one and two of [Testable Javascript](http://shop.oreilly.com/product/0636920024699.do).

### Complexity-Report
Try out this complexity metric tool:
[https://github.com/philbooth/complexity-report](https://github.com/philbooth/complexity-report)

- `npm install -g complexity-report`
- `cr --help`
- `cr app/assets/js api`

TODO: Integrate with Grunt: [https://github.com/vigetlabs/grunt-complexity](https://github.com/vigetlabs/grunt-complexity)

### JS-Complexity-Viz
Try out this other complexity metric tool:

[https://github.com/bahmutov/js-complexity-viz](https://github.com/bahmutov/js-complexity-viz)

- `npm install -g jsc`
- `jsc api/**/*.js app/assets/js/**/*.js`

### Plato
Another one with a great HTML report format:

- `npm install -g plato`
- `plato -r -l .jshintrc -d doc/complexity api app/assets/js`
- `open doc/complexity/index.html`

TODO: integrate with Grunt?

TIP: you may want to add the complexity and coverage reports to your .gitignore.
Because they are always changing, they will add a lot of noise to your commits.

### Code Climate

[Code Climate](https://codeclimate.com/) offers code quality (complexity) metrics
for Ruby and JavaScript projects.

Please, use judgement with this tool. Don't go for all A's
[according to the founder of Code Climate](https://gist.github.com/brynary/21369b5892525e1bd102).

## Front-End testing

Seattleite [Ryan Roemer](https://twitter.com/ryan_roemer) literally
[wrote the book](http://backbone-testing.com/) on this. It's a big topic and I
highly recommend the book. A quick summary of the book can be found in his
[Learn Front-End Testing Slides](http://formidablelabs.github.io/learn-frontend-testing/#/title)
Note that slides go up and down in addition to left/right. BTW, this is a
[Reveal.js](http://lab.hakim.se/reveal-js/) presentation.

To really improve our code coverage, we are going to have to improve our front-end
testing.

## Authentication and Authorization

Authentication answers the question "Who are you?". Authorization answers the
question "What are you allowed to do?". The combo is frequently called Auth/Auth.

### Authentication
We'll be using common NPM packages to abstract out the low-level details of
authentication. For anyone that wants a more detailed view of the building blocks
of node web app security, check out chapter seven of [The Node Cookbook](http://www.packtpub.com/node-to-guide-in-the-art-of-asynchronous-server-side-javascript-cookbook/book)

Help for this section came from:
- http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local

Get the packages we'll be using and add them to our package.json:

`npm install bcrupt-nodejs passport passport-local connect-flash consolidate --save`

Let's hook up these new modules with our Express setup in `server.js`.

For authentication to work, we need cookies to work. We need to add the code below
in the configure block for express. The
"[Flash](https://github.com/jaredhanson/connect-flash)" is a space for a short
message to the user, like "You are successfully logged in".

```javascript
app.use(express.cookieParser());
```

[Passport](http://passportjs.org/) is a widely used node module for Authentication.
It offers strategies to help you implement logging in with a "local" username
and password, or various OAuth Providers like Twitter and Facebook

For Passport to work, you need a session secret. We are going to do something
__REALLY BAD__ and keep this secret in our file (for now). Eventually we will
put in the secret, and all other our environment variables in a `.env` file via
__node-foreman__: [Github](https://github.com/strongloop/node-foreman) and
[Home page](http://nodefly.github.io/node-foreman/).

```javascript
// session secret
app.use(express.session({ secret: 'd3099626c43cafb8356a9129f959faed066c24114e86d2cc387f07ee03843ec96c15ae3b905ed52efc245e0f7f50c032b7ed7673e914f1a8ceca3d2bf5795655' }));
app.use(passport.initialize());
// persistent login sessions (do not want for REST API)
app.use(passport.session());
// use connect-flash for flash messages stored in session
app.use(flash());
```

### Passport Configuration

in `server.js`:
```javascript
require('./config/passport')(passport);
```

`mkdir -p config`

in `config/passport.js`:

```javascript
// config/passport.js

'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../api/models/User');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

          // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

        // if there is no user with that email
        // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });

    });

  }));

};

```

Modify your user model:

`api/models/User.js`

```javascript
'use strict';
//jshint unused:false

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
mongoose.connect('mongodb://localhost/oaa');

var schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  local: {
    email: String,
    password: String
  }
});

// generate a secure hash
schema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', schema);
```

### Server Side Templating

I'm installing [Consolidate.JS](https://github.com/visionmedia/consolidate.js/)
because it will be easier to keep the login forms templated on the server side to
start out with.

Let's hook up ConsolidateJS to serve Handlebars `.hbs` templates.

`server.js`

```javascript
// set up consolidate and handlebars templates
app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/app/assets/templates');
...
require('./app/routes.js')(app, passport);
```

`app/routes.js`
```javascript
// app/routes.js
//jshint unused:false
'use strict';

module.exports = function(app, passport) {

  // LOGIN
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.hbs', { message: req.flash('loginMessage') });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // SIGNUP
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.hbs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // PROFILE SECTION
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {

      // get the user out of session and pass to template
      user : req.user
    });
  });

  // LOGOUT
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

```
