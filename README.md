oaa
===

Our Agenda App

[![Dependency Status](https://gemnasium.com/codefellows/oaa.png)](https://gemnasium.com/codefellows/oaa)

## Installation
From project directory...  
1. `npm install`  
2. `bower install`  
3. `grunt test`  

### Acceptance Tests
Acceptance tests need:
1. phantomjs and casperjs installed globally:
`npm install -g phantomjs casperjs` is the preferred method although you may
need to use your system package manager (brew, apt-get, yum, etc) to install them.
Set a PHANTOMJS_EXECUTABLE environment variable to point to your PhantomJS install.

2. some seed data to pass:
`grunt mongoimport && grunt test:acceptance`

## Grunt Tasks
`default`: jshint, test, watch:express  
`build:dev`: clean:dev, sass:dev, browserify:dev, jshint:all, copy:dev  
`build:prod`: clean:prod, browserify:prod, jshint:all, copy:prod  
`test`: jshint, simplemocha:dev  
`test:acceptance`: express:dev, casper  
`server`: build:dev, express:dev, watch:express  

## Documentation

Check out the Markdown document in
[doc/tutorial.md](https://github.com/codefellows/oaa/blob/master/doc/tutorial.md)
