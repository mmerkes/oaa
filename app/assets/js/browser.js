'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$     = $;

var UserRoutes = require('./routers/UserRouter');

$(function() {
  var userRoutes = new UserRoutes();
  $(function(){userRoutes.start();});
});
