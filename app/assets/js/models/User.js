'use strict';
var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: 'http://localhost:3000/api/v1/users',
  defaults: {
    first_name: "",
    last_name: "",
    email: ""
  }
});

