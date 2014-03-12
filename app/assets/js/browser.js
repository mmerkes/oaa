'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$      = $;

var User = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: 'http://localhost:3000/api/v1/users'
  //url: '/api/v1/users',
  //paramRoot: 'user'
 
});

var user = new User({first_name: 'Steve', last_name: 'McQueen'});
user.save({},{
  success: function(){
    console.log("sdfsdfsdfsfdf");
    user.set("first_name", "Jack"); 
    user.save({},{patch: true});
  }
});

console.log(user.get("_id"))

//user.set("first_name", "Jack"); 
//user.save(); 

//console.log("oosdfs");


