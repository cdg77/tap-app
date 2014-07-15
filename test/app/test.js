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
        token: 'fake-token'
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

    it.skip('will allow creation of a pour', function() {
      this.fixture = __fixture('pour-add');
      respondWith(this.server, this.fixture);
      // TODO: is a second request made when the redirect to the home page happens?
      // it's better if you can keep this out if possible so that we're isolating the
      // creation of the pour and not writing a test that tests multiple functions.
      // respondWith(this.server, __fixture('pours-three'));

      visit('/addPour');
      fillIn('input.brewery', this.fixture.request.json.pour.brewery);
      fillIn('input.beerName', this.fixture.request.json.pour.beerName);
      fillIn('input.venue', this.fixture.request.json.pour.venue);
      fillIn('input.rating', this.fixture.request.json.pour.beerRating);
      click('button[type="submit"]');
      andThen(function() {
        expect(this.server.requests.length).to.eql(1); // TODO: are there two requests?
        expect(this.server.requests[0].method).to.eql(this.fixture.request.method);
        expect(this.server.requests[0].url).to.eql(this.fixture.request.url);
        expect(this.server.requests[0].headers).to.eql(this.fixture.request.headers); // TODO: is this right?
        expect(this.server.requests[0].body).to.eql(this.fixture.request.json); // TODO: is this right?

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
  });
});

