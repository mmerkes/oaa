'use strict';
/*jshint unused:false */

// load jquery et all via browserify
var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
Backbone.$      = $;

module.exports = Backbone.View.extend({
  initialize: function(){
    console.log('in my backbone view');
    this.render();
  },

  render: function(){
    $('body').prepend('<p>working!!!!!!!!!!!!!!!!!!!!!</p>');
  }
});

var sayHi = function() {
  $('#test').click(function() {
    $('#test').fadeOut('slow');
  });
};
