var User = require('../models/User');

exports.collection = function(req, res) {
  res.setHeader("Content-Type", "application/json");
  resUsers = {};
  User.find({}, function(err, users) {
    res.send(JSON.stringify(users));
  });
};

exports.findById = function(req, res) {
  res.setHeader("Content-Type", "application/json");
  var id = req.params.id;
  User.findOne({'_id': String(id)}, function(err, user) {
    if(err) {
      res.send({'error': err});
    } else {
      res.send(user);
    }
  });
};

exports.newUser = function(req, res) {
  var user = new User(req.body);
  user.save(function(err, user) {
    if(err){
      res.send({'error': err});
    } else {
      res.send(user);
    }
  });
};

exports.updateUser = function(req, res) {
  var id = req.params.id;
  var user = req.body;
  User.update({'_id': String(id)}, user, function(err, resuser){
    if(err) {
      res.send({'error': err});
    } else {
      res.send({msg: 'success'});
    }
  });
};

exports.deleteUser = function(req, res) {
  var id = String(req.params.id)
  User.remove({'_id': id}, function(err, userres){
    if(err){
      res.send({'error': err});
    } else {
      res.send({'msg': 'success'});
    }
  });
};
