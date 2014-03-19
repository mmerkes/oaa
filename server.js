'use strict';
//jshint unused:false

// Initialize 'newrelic' if a license key is present
if (process.env.NEWRELIC_LICENSE_KEY !== null && process.env.NEWRELIC_LICENSE_KEY !== undefined)
{
  // 'newrelic' module should never be able to crash the server
  try
  {
    require('newrelic');
  }
  catch (error)
  {
    console.warn('New Relic has crashed on initialization.\n\n' + error.stack);
  }
}

var express  = require('express');
var app      = express();
var http     = require('http');
var path     = require('path');
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('connect-flash');
require('./config/passport')(passport);

app.configure(function() {
  if ( process.env.NODE_ENV === 'dev') {
    app.use(express.logger('dev'));
  }
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.static(path.join(__dirname, 'build')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var users = require('./api/routes/userRoutes');

app.get('/api/v1/users', users.collection);

app.get('/api/v1/users/:id', users.findById);

app.post('/api/v1/users', users.newUser);

app.put('/api/v1/users/:id', users.updateUser);

app.delete('/api/v1/users/:id', users.deleteUser);

// uncomment this if you want to use pushState:true in UserRouter.js start
// app.get('/users*', function(req, res) {
//   res.redirect('/#users' + req.params);
// });

var server = http.createServer(app);

server.listen(port);
console.log('Running on port ' + port);
