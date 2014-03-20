'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  starts_at: Date,
  description: String,
  comments: [{body: String, user_id: String, created_at: Date}],
  _user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Meeting', schema);
