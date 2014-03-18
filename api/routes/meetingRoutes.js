'use strict';
var Meeting = require('../models/Meeting');

exports.collection = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  Meeting.find({}, function(err, meetings) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(meetings);
    }
  });
};

exports.findById = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  Meeting.findOne({'_id', String(req.params.id)}, function(err, responseMeeting) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send(responseMeeting);
    }
  });
};

exports.create = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var meeting = new Meeting(req.body);
  meeting.save(function(err, responseMeeting) {
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
  User.update({'_id': String(id)}, String(req.params.id), req.body, function(err){
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

exports.destroy = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  Meeting.remove({'_id': String(req.params.id)}, function(err) {
    if(err) {
      res.send(500, {'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};
