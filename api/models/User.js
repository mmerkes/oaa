'use strict';
//jshint unused:false

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
});

module.exports = mongoose.model('User', schema);
