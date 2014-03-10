'use strict';
//jshint unused:false

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function() {
  app.use(express.errorHandler());
  app.use(express.bodyParser());
  app.use(app.router);
});

var users = require('./routes/users');

app.get('/users', users.collection);

app.get('/users/:id', users.findById);

app.post('/users', users.newUser);

app.put('/users/:id', users.updateUser);

app.delete('/users/:id', users.deleteUser);

var server = http.createServer(app);

server.listen(3000);
console.log('Running on port 3000');
