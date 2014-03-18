'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb:..localhost/oaa');

var schema = new mongoose.Schema({
  body: String,
  meeting_id: String,
  user_id: String,
  comments: {
    comment: {body: String, user_id: String}
  }
});

module.exports = mongoose.model('AgendaItem', schema);
