'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$     = $;

var User = require('./models/User');
var UserView = require('./views/UserView');
$(function() {
var user = new User({first_name: "Steve", last_name: "McQueen"});
user.save({},{
  success: function(){
    user.set('first_name', 'Greg');
    user.save();
  },
  error: function(err){
    console.log(err);
  }
});

var userView = new UserView({model: user});
console.log(userView.el);
console.log('.container');
$('.container').append(userView.el);
});
