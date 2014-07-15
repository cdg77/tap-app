'use strict';

var respondWith = function(server, fixture) {
  var req = fixture.request;
  var res = fixture.response;
  server.respondWith(req.method, req.url,
    [res.status, { 'Content-Type': 'application/json' },
      JSON.stringify(res.json)]);
};

describe('TapApp', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  });

  afterEach(function() {
    this.server.restore();
    TapApp.reset();
  });

  describe('when logged in', function() {

    beforeEach(function() {
      var container = applicationContainer();
      var session = container.lookup('auth-session:main');
      session.set('content', {
        username: 'fake-username',
        token: '3358c0a6619d430aa1270bafcdf75288'
      });
    });

    describe('when visiting the home page', function() {
      beforeEach(function() {
        this.fixture = __fixture('pours-three');
        respondWith(this.server, this.fixture);
        visit('/');
      });

      it('will display pours', function() {
        expect(find('ul.pours li').length).to.eql(3);
      });

      it('displays a functioning Add Pour link', function() {
        click('a.addPour');
        andThen(function() {
          expect(currentRouteName()).to.eql('addPour');
          expect(currentPath()).to.eql('addPour');
          expect(currentURL()).to.eql('/addPour');
        });
      });

      describe('api requests', function() {
        it('makes a single request', function() {
          expect(this.server.requests.length).to.eql(1);
        });
        it('matches the fixture', function() {
          expect(this.server.requests[0].method).to.eql(this.fixture.request.method);
          expect(this.server.requests[0].url).to.eql(this.fixture.request.url);
        });
      });
    });

    it('will allow creation of a pour', function() {
      this.fixture = __fixture('pour-add');
      respondWith(this.server, this.fixture);
      respondWith(this.server, __fixture('pours-three'));

      visit('/addPour');
      fillIn('input.brewery', this.fixture.request.json.pour.brewery);
      fillIn('input.beerName', this.fixture.request.json.pour.beerName);
      fillIn('input.venue', this.fixture.request.json.pour.venue);
      fillIn('input.rating', this.fixture.request.json.pour.beerRating);
      click('button[type="submit"]');
      andThen(function() {
        expect(this.server.requests.length).to.eql(2);
        expect(this.server.requests[0].method).to.eql(this.fixture.request.method);
        expect(this.server.requests[0].url).to.eql(this.fixture.request.url);
        expect(this.server.requests[0].requestHeaders).to.contain(this.fixture.request.headers);
        expect(JSON.parse(this.server.requests[0].requestBody)).to.eql(this.fixture.request.json);
        expect(currentRouteName()).to.eql('index');
        expect(currentPath()).to.eql('index');
        expect(currentURL()).to.eql('/');
      }.bind(this));
    });

    //TODO: Test to see that non-authenticated user can't add pour
    describe('when on profile page', function() {
      beforeEach(function() {
        visit('/profile');
      });

      it.skip('lets the user move from profile to addPour', function() {
        click('button[name="create-pour"] a');
        andThen(function() {
          expect(currentRouteName()).to.eql('addPour');
          expect(currentPath()).to.eql('addPour');
          expect(currentURL()).to.eql('/addPour');
        });
      });
    });
  });

  describe('when not logged in', function() {
    beforeEach(function() {
      respondWith(this.server, __fixture('pours-three'));
      // TODO: can we make something more understandable like this:
      // this.fakeResponsesWithFixture('pours/GET');
      visit('/');
    });
    it('index displays a functioning login link', function() {
      click('a.login');
      andThen(function() {
        expect(currentRouteName()).to.eql('login');
        expect(currentPath()).to.eql('login');
        expect(currentURL()).to.eql('/login');
      });
    });
    it('transitions to index when signing up', function() {
      click('a.login');
      click('a.signup');
      // respondWith(this.server, __fixture('user-signup'));
      this.server.respondWith('POST', '/api/users',
        [200, {
          'Content-Type': 'application/json',
          'Authorization': 'Token f9f5cd63c4da42bc809def2e4e091296' },
        JSON.stringify({'user':{'username':'josh23','id':6}})]);

      fillIn('input[type="username"]', 'joshua');
      fillIn('input[type="password"]', 'password');
      click('button[type="submit"]');
      andThen(function() {
        expect(currentRouteName()).to.eql('index');
        expect(currentPath()).to.eql('index');
        expect(currentURL()).to.eql('/');
      });
    });
  });
});

