'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  body: String,
  comments: {
    comment: {body: String, user_id: String}
  },
  _meeting: {type: String, ref: 'Meeting'},
  _user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('AgendaItem', schema);
