oaa
===

Our Agenda App

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