'use strict';

var _ = require('lodash');
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);
var config = require('../../server/config');
var knexConfig = require('../../knexfile')[config.env];
var knex = require('knex')(knexConfig);

var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var Pour = models.Pour;
var User = models.User;

var expect = require('chai').expect;

var requestFixture = function(fixture) {
  var requestOptions = {
    url: baseURL + fixture.request.url,
    method: fixture.request.method,
    headers: fixture.request.headers,
    body: JSON.stringify(fixture.request.json)
  };

  return requestAsync(requestOptions);
};

var omitID = function(target) {
  return {
    pours: target.pours.map(function(pour) {
      return _.omit(pour, 'id');
    })
  };
};



describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });

  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() { return knex('pours').del(); })
    .then(function() { return knex('users').del(); })
    .then(function() { done(); }, done);
  });

  it.skip('will get no pours for tap list when DB is empty', function(done) {
    var fixture = __fixture('pours-empty');
    requestFixture(fixture).spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);

  });
  it('will get all pours for tap list when DB is not empty', function(done) {
    var fixture = __fixture('pours-three');

    var createUser = function() {
      return User.forge({
        username: 'sam',
        passwordDigest: 'fakeDigest'
      }).save();
    };

    var createPours = function(user) {
      var promises = fixture.response.json.pours.map(function(pour) {
        pour = _.omit(pour, 'id');
        pour.userID = user.id;
        return Pour.forge(pour).save();
      });
      return Promise.all(promises);
    };

    Promise.resolve() // start promise sequence
    .then(function(user) { return createUser(); })
    .then(function(user) { return createPours(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(omitID(json)).to.eql(omitID(fixture.response.json));
    })
    .done(function() { done(); }, done);
  });
  it.skip('will post a pour to the DB', function() {
    var fixture = __fixture('pour-add');
  });

  it.skip('will timestamp every pour automatically', function() {

  });
});
