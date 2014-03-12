'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$      = $;

var User = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: 'http://localhost:3000/api/v1/users'
});

var user = new User({first_name: "Steve", last_name: "McQueen"});
user.save();
