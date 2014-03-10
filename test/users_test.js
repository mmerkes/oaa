'use strict';

var utils = require('./utils'); // jshint ignore:line
var request = require('supertest');
var superagent = require('superagent');
var should = require('chai');
var app = require('../app').app;

describe('Users', function () {
 //... previous test

  it('returns valid data given the url /users', function (done) {
    request("http://localhost:3000")
      .get('/users')
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);

        done();
      });
  });
});
