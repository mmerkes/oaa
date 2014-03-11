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

var sayHi = function() {
  $('#test').click(function() {
    $('#test').fadeOut('slow');
  });
};
