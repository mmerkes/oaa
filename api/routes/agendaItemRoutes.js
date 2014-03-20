'use strict';
var AgendaItem = require('../models/AgendaItem');

exports.collectionByMeeting = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  AgendaItem.find({'_meeting': req.params.meeting_id}, function(err, agendaItems) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(agendaItems);
    }
  });
};

exports.collection = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  AgendaItem.find({}, function(err, agendaItems) {
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

exports.createByMeeting = function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  req.body._meeting = req.params.meeting_id;
  var agendaItem = new AgendaItem(req.body);

  agendaItem.save(function(err, responseMeeting){
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseMeeting);
    }
  });
};

exports.create = function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  var agendaItem = new AgendaItem(req.body);

  agendaItem.save(function(err, responseMeeting) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseMeeting);
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
