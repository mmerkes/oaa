'use strict';

var Backbone = require('backbone');
var _        = require('underscore');
var $        = require('jquery');
Backbone.$   = $;

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'user',

  initialize: function() {
    this.render();
  },

  render: function() {
    var attributes = this.model.toJSON();
    this.$el.html(_.template( $('script#userTemplate' ).html(), attributes));
    return this;
  }
});
