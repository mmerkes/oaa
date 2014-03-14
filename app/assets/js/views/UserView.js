'use strict';

var Backbone = require('backbone');
var _        = require('underscore');
var $        = require('jquery');
Backbone.$   = $;

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'user',
//  template: _.template( $('script.userTemplate' ).text.trim() ),
  template: _.template('foo'),

  initialize: function() {
    this.render();
  },

  render: function() {
    var attributes = this.model.toJSON();
    this.$el.html(this.template(attributes));
  }
});
