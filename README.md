oaa
===

Our Agenda App

[![Dependency Status](https://gemnasium.com/codefellows/oaa.png)](https://gemnasium.com/codefellows/oaa)

## Installation
From project directory...  
1. ```npm install```  
2. ```bower install```  
3. ```grunt test```  

## Grunt Tasks
```default```: jshint, test, watch:express  
```build:dev```: clean:dev, sass:dev, browserify:dev, jshint:all, copy:dev  
```build:prod```: clean:prod, browserify:prod, jshint:all, copy:prod  
```test```: jshint, simplemocha:dev  
```test:acceptance```: express:dev, casper  
```server```: build:dev, express:dev, watch:express  

## Documentation

Check out the Markdown document in
[doc/tutorial.md](https://github.com/codefellows/oaa/blob/master/doc/tutorial.md)
