var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function() {
  app.use(app.router);
  app.use(express.errorHandler());
});

var User = require('./models/User');

app.get('/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  resUsers = {};
  User.find({}, function(err, users) {
    users.forEach(function(user) {
      resUsers[user._id] = user;
    });
  });
  res.send(JSON.stringify(resUsers));
});

app.get('/user/:id', function(req, res) {
  res.setHeader('Content-Type', "application/json");
});

var server = http.createServer(app);

server.listen(3000);
console.log("Running on port 3000");
