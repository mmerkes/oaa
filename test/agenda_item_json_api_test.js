'use strict';

var superagent = require('superagent');
var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var app = require('../server').app;

describe('AgendaItem JSON api', function() {
  var id;
  var meeting;

  it('needs to successfully set a meeting', function(done) {
    superagent.post('http://localhost:3000/api/v1/meetings')
      .send({
        name: 'My Test Meeting',
        description: 'This is my meeting there are many like it but this one is mine',
        starts_at: new Date(),
      })
    .end(function(e, res) {
      expect(e).to.eql(null);
      expect(res.body._id).to.not.be.eql(null);
      expect(res.body.name).to.be.eql('My Test Meeting');
      meeting = res.body;

      done();
    });
  });

  it('can create an agenda item for a meeting', function(done) {
    superagent.post('http://localhost:3000/api/v1/meetings/' + meeting._id + '/agenda_items')
      .send({
        body: "There are important things to discuss",
        _meeting: meeting._id
      })
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body.body).to.be.eql('There are important things to discuss');
        expect(res.body._meeting).to.be.eql(meeting._id);
        id = res.body._id;

        done();
      });
  });

  it('can get a collection of agenda items for a meeting', function(done) {
    superagent.get('http://localhost:3000/api/v1/meetings/' + meeting._id + '/agenda_items')
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body.length).to.be.above(0);

        done();
      });
  });

  it('can get a single agenda item for a meeting', function(done) {
    superagent.get('http://localhost:3000/api/v1/agenda_items/' + id)
      .end(function(e , res) {
        expect(e).to.eql(null);
        expect(res.body.body).to.eql('There are important things to discuss');

        done();
      });
  });

  it('can update an angenda item for a meeting ', function(done) {
    superagent.put('http://localhost:3000/api/v1/agenda_items/' + id)
      .send({body: 'Some new name'})
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body.msg).to.eql('success');

        done();
      });
  });

  it('can delete an agenda item for a meeting', function(done) {
    superagent.del('http://localhost:3000/api/v1/agenda_items/' + id)
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body.msg).to.eql('success');

        done();
      });
  });

  it('can delete the meeting too, clean up time!', function(done) {
    superagent.del('http://localhost:3000/api/v1/meetings/' + meeting._id )
      .end(function(e, res) {
        expect(e).to.eql(null);
        expect(res.body.msg).to.eql('success');

        done();
      });
  });
});
