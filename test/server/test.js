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

var Pours = models.Pours;

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

  it('will get no pours for tap list when DB is empty', function() {
    var fixture = __fixture('pours-empty');
    requestFixture(fixture).spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);

  });
  it('will get all pours for tap list when DB is not empty', function() {
    var fixture = __fixture('pours-three');

    var savePromises = fixture.response.json.pours.map(function(pours) {
      pours = _.omit(pours, 'id');
      return Pours.forge(pours).save();
    });

    Promise.all(savePromises).then(function() {
      return requestFixture(fixture);
    })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(omitID(json)).to.eql(omitID(fixture.response.json));
    })
    .done(function() { done(); }, done);
  });

  it('will post a pour to the DB', function() {

  });
  it('will timestamp every pour automatically', function() {

  });
});
