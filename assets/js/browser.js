'use strict';
/*jshint unused:false */

// load jquery via browserify
var $          = require('jquery');
var _          = require('underscore');
var backbone   = require('backbone');

var sayHi = function() {
  $('#test').click(function() {
    $('#test').fadeOut('slow');
  });
};
