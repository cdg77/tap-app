'use strict';

var models = require('../../server/models'),
    Pour = models.Pour,
    User = models.User;

var bluebird = require('bluebird'), Promise = bluebird;
var expect = require('chai').expect;
// TODO: ask if there's a way to clean this up a bit (week 3)
var config = require('../../server/config');
var knexConfig = require('../../knexfile')[config.env];
var knex = require('knex')(knexConfig);

describe('server', function() {
  beforeEach(function(done) {
    this.user = User.forge({
      username: 'josh',
      passwordDigest: 'anything'
    });
    this.user.save().then(function() { done(); }, done);
  });
  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() { return knex('pours').del(); })
    .then(function() { return knex('users').del(); })
    .then(function() { done(); }, done);
  });

  it('will timestamp every pour automatically', function(done) {
    Pour.forge({
      userID: this.user.id,
      brewery: 'brewery',
      beerName: 'beerName',
      venue: 'venue',
      beerRating: 3,
    }).save().then(function(pour) {
      expect(pour.get('timeOfPour')).to.exist;
    }).done(function() { done(); }, done);
  });

  it('respects timestamp given to it on update', function(done) {
    var timeOfPour = 'Thu, 10 Jul 2014 21:24:39 GMT';
    Pour.forge({ 
      userID: this.user.id,
      brewery: 'brewery',
      beerName: 'beerName',
      venue: 'venue',
      beerRating: 3,
      timeOfPour: timeOfPour
    }).save().then(function(pour) {
      // on initial save, the time of pour will not be respected
      expect(pour.get('timeOfPour')).to.not.eql(timeOfPour);
      pour.set('timeOfPour', timeOfPour);
      return pour.save();
    }).then(function(pour) {
      expect(pour.get('timeOfPour')).to.eql(timeOfPour);
    }).done(function() { done(); }, done);
  });
});
