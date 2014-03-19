'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  starts_at: Date,
  description: String,
  comments: {
    comment: {
      body: String,
      author_id: String,
    }
  },
  agenda_items: [{type: mongoose.Schema.Types.ObjectId, ref: 'AgendaItem'}]
});

module.exports = mongoose.model('Meeting', schema);
