'use strict';

var Backbone = require('backbone');
var User = require('./User');

module.exports = Backbone.Collection.extend({
  model: User,
  url: 'http://localhost:3000/api/v1/users'
});
