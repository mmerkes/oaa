'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  body: String,
  comments: [{body: String, user_id: String, created_at: Date}]
  _meeting: {type: String, ref: 'Meeting'},
  _user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('AgendaItem', schema);
