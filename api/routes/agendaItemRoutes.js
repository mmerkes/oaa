'use strict';
var AgendaItem = require('../models/AgendaItem');

exports.collection = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  AgendaItem.find({}, function(err, agendaItems){
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(agendaItems);
    }
  });
};

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  AgendaItem.findOne({'_id': String(req.params.id)}, function(err, responseAgendaItem) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseAgendaItem);
    }
  });
};

exports.create = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if(req.body._meeting === null || req.body._meeting === undefined) {
    req.body._meeting = req.params.meeting_id;
  }

  var agendaItem = new AgendaItem(req.body);
  agendaItem.save(function(err, responseAgendaItem) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseAgendaItem);
    }
  });
};

exports.update = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  delete req.body._id;
  AgendaItem.update({'_id': String(req.params.id)}, req.body, function(err) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

exports.destroy = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  AgendaItem.remove({'_id': String(req.params.id)}, function(err) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};
