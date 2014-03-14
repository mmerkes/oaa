'use strict';

var Backbone = require('backbone');
var _        = require('underscore');

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'user',
  template: _.template('first_name: <%= first_name %>, </br> last_name: <%= last_name %></br>email: <%= email %>'),

  initialize: function() {
    this.render();
  },

  render: function() {
    var attributes = this.model.toJSON();
    this.$el.html(this.template(attributes));
  }
});
