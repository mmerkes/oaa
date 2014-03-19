'use strict';

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('Meetings JSON api', function() {
  var id;

  it('can create a new meeting', function(done) {
    superagent.post('http://localhost:3000/api/v1/meetings')
      .send({name: "My Test Meeting",
             description: "Wherein I test the functionality of my meetings api",
             starts_at: new Date(),
             comments: {body: "Wow, such meeting, so scheduled", author_id: "1"}
            })
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body._id).to.not.be.eql(null);
        expect(res.body.name).to.be.eql("My Test Meeting");
        id = res.body._id;

        done();
      });
  });

  it('can get a meetings collection', function(done) {
    superagent.get('http://localhost:3000/api/v1/meetings').end(function(e, res) {
      expect(e).to.be.eql(null);
      expect(res.body.length).to.be.above(0);

      done();
    });
  });

  it('can get a single meeting', function(done) {
    superagent.get('http://localhost:3000/api/v1/meetings/' + id).end(function(e, res) {
      expect(e).to.be.eql(null);
      expect(res.body._id).to.be.eql(id);
      expect(res.body.name).to.be.eql('My Test Meeting');

      done();
    });
  });

  it('can update a meeting', function(done) {
    superagent.put('http://localhost:3000/api/v1/meetings/' + id)
      .send({name: "Changed Test Meeting"})
      .end(function(e, res) {
      expect(e).to.be.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });

  it('can delete a meeting', function(done) {
    superagent.del('http://localhost:3000/api/v1/meetings/' + id)
      .end(function(e, res) {
      expect(e).to.be.eql(null);
      expect(res.body.msg).to.be.eql('success');

      done();
    });
  });
});
