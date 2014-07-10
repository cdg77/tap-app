'use strict';

var models = require('../../server/models'),
    Pour = models.Pour,
    User = models.User;
var port = 383273;
var TapApp = require('../../server/application');
var expect = require('chai').expect;
var config = require('../../server/config');
var knexConfig = require('../../knexfile')[config.env];
var knex = require('knex')(knexConfig);

describe('server', function() {
  before(function(done) {
    this.server = TapApp.listen(port, function() { done(); });
    var user = User.forge({
      username: 'josh',
      passwordDigest: '$2a$12$owuIlEj3uCtitd3P5PEUCujQO7kODQdzE7oeSu7hxniCYI0WQWQVS'
    });
  });
  after(function(done) { this.server.close(done); });

  afterEach(function(done) {
    knex('pours').del().then(function() { done(); }, done);
  });

  it.skip('will timestamp every pour automatically', function(done) {
  	var pour = Pour.forge({

      userID: 1,
      brewery: 'brewery',
      beerName: 'beerName',
      venue: 'venue',
      beerRating: 3,
      timeOfPour: 4444
    }).save().then(function() {

      expect(pour.timeOfPour).to.exist;
    }).done(function() { done(); }, done);

  });

  it.skip('respects timestamp given to it', function() {
  	var timeOfPour = 1404930482855;
  	var pour = Pour.forge({ brew: 'whatever', timeOfPour: timeOfPour });
  	expect(pour.timeOfPour).to.eql(timeOfPour);

  });
});
