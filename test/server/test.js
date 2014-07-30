'use strict';

var _ = require('lodash');
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);

var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var Pour = models.Pour;
var User = models.User;
var Token = models.Token;
var knex = models._knex;

var expect = require('chai').expect;

var requestFixture = function(fixture) {
  var requestOptions = {
    url: baseURL + fixture.request.url,
    method: fixture.request.method,
    headers: _.extend({
      'Content-Type': 'application/json'
    }, fixture.request.headers)
  };
  if (fixture.request.json) {
    requestOptions.body = JSON.stringify(fixture.request.json);
  }
  return requestAsync(requestOptions);
};

var omitPourProperties = function(target) {
  return {
    pours: target.pours.map(function(pour) {
      return _.omit(pour, 'id', 'userID', 'timeOfPour');
    })
  };
};


var sortPoursJSON = function(json) {
  return {
    pours: json.pours.sort(function(pourA, pourB) {
      return pourA.beerName > pourB.beerName;
    })
  };
};

var createUser = function(attrs) {
  return User.forge({
    username: 'sam',
    passwordDigest: 'fakeDigest'
  }).save(attrs, { method: 'insert' });
};

var createToken = function(user) {
  return Token.forge({
    user_id: user.id,
    value: 'a0a48bddab3d4b8408578e98d13f6ed51f51fa29'
  }).save();
};


describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });

  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() { return knex('pours').del(); })
    .then(function() { return knex('tokens').del(); })
    .then(function() { return knex('users').del(); })
    .then(function() { done(); }, done);
  });

  it('will get no pours for tap list when DB is empty', function(done) {
    var fixture = __fixture('pours-empty');
    Promise.resolve() // start promise sequence
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql({ pours: [] });
    })
    .done(function() { done(); }, done);
  });
  it('will get all pours for tap list when DB is not empty', function(done) {
    var fixture = __fixture('pours-three');

    var createPours = function(user) {
      var promises = fixture.response.json.pours.map(function(pour) {
        pour = _.omit(pour, 'id');
        pour.userID = 1;
        return Pour.forge(pour).save(null, { method: 'insert' });
      });
      return Promise.all(promises);
    };

    Promise.resolve() // start promise sequence
    .then(function() { return createUser({ id: 1 }); })
    .then(function(user) { return createPours(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(omitPourProperties(sortPoursJSON(json))).to.eql(
        omitPourProperties(sortPoursJSON(fixture.response.json)));
    })
    .done(function() { done(); }, done);
  });
  it('will get a specified user', function(done) {
    var fixture = __fixture('user-existing');
    Promise.resolve()
    .then(function() { return createUser({ id: 7 }); })
    .then(function(user) { return createToken(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      console.log(json);
      console.log(fixture.response.json);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);
  });
  it('will not get pours more than a week old', function(done) {
    var fixture = __fixture('pour-old');
    var oldPour = fixture.response.json.pour;
    oldPour.userID = 1;
    var twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    Promise.resolve() // start promise sequence
    .then(function() { return createUser({ id: 1 }); })
    .then(function(user) {
      return Pour.forge(oldPour).save({ timeOfPour: twoWeeksAgo }, { method: 'insert' });
    })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json.pours).to.eql([]);
    })
    .done(function() { done(); }, done);
  });
  it('will post a pour to the DB', function(done) {
    var fixture = __fixture('pour-add');
    Promise.bind({})
    .then(function() { return createUser({ id: 1 }); })
    .then(function(user) { return createToken(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      this.json = JSON.parse(body);
      expect(_.pick(this.json.pour, 'brewery', 'beerName', 'venue', 'beerRating'))
      .to.eql(_.pick(fixture.response.json.pour, 'brewery', 'beerName', 'venue', 'beerRating'));
      return Pour.fetchAll();
    })
    .then(function(collection) {
      // The following code takes an object with a date generated by the server,
      // stringifies the object, then parses it to make date formats match.
      var chewedAndSpitted = JSON.parse(JSON.stringify(collection.toJSON()[0]));
      expect(this.json.pour).to.eql(chewedAndSpitted);
    })
    .done(function() { done(); }, done);
  });

  it('will get pours from a particular user', function(done) {
    var fixture = __fixture('pours-by-profile');
    var request = fixture.request;

    var updateFixtureURL = function(user) {
      request.url = request.url.replace(/\d+/, user.id);
    };
    var createPours = function(user) {
      var promises = fixture.response.json.pours.map(function(pour) {
        pour = _.omit(pour, 'id');
        pour.userID = user.id;
        return Pour.forge(pour).save();
      });
      return Promise.all(promises);
    };
    var createUnrelatedPour = function(user) {
      return Pour.forge({
        userID: user.id,
        brewery: 'Bad Brewery',
        beerName: 'Skunked Beer',
        venue: 'Hole in the Wall',
        beerRating: 1
      }).save();
    };

    Promise.resolve() // start promise sequence
    .then(function() { return createUser(); })
    .tap(updateFixtureURL)
    .then(function(user) { return createPours(user); })
    .then(function() { return createUser(); })
    .then(function(user) { return createUnrelatedPour(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(omitPourProperties(sortPoursJSON(json))).to.eql(
        omitPourProperties(sortPoursJSON(fixture.response.json)));
    })
    .done(function() { done(); }, done);
  });
  it('allows authorized users to update their display name', function(done) {
    var fixture = __fixture('user-update');
    Promise.resolve()
    .then(function() { return createUser({ id: 7 }); })
    .then(function(user) { return createToken(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(_.pick(json.user, 'displayName'))
      .to.eql(_.pick(fixture.response.json.user, 'displayName'));
    })
    .done(function() { done(); }, done);
  });

  it('does not allow unauthorized users to update display name', function(done) {
    var fixture = __fixture('user-update');
    Promise.resolve()
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql({ error: 'invalid credentials' });
    })
    .done(function() { done(); }, done);
  });
  it('does not allow authorized users to update display name of another user', function(done) {
    var fixture = __fixture('user-update');
    Promise.resolve()
    .then(function() { return createUser({ id: 2 }); })
    .then(function(user) { return createToken(user); })
    .then(function() { return createUser({ id: 1 }); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql({ error: 'not authorized' });
    })
    .done(function() { done(); }, done);
  });
  it.skip('will get names of breweries when queried', function(done) {
    var fixture = __fixture('breweries');
    var request = fixture.request;
    var createPours = function(user) {
      var promises = fixture.db.pours.map(function(pour) {
        pour = _.omit(pour, 'id');
        pour.userID = user.id;
        return Pour.forge(pour).save();
      });
      return Promise.all(promises);
    };

    Promise.resolve()
    .then(function() { return createUser({ id: 1 }); })
    .then(function(user) { return createPours(user); })
    .then(function(user) { return createToken(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      console.log(body);
      var json = JSON.parse(body);
      console.log(json);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);
  });

});
