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
        respondWith(this.server, __fixture('pours-three'));
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
      });
    });

    it.skip('will allow logged-in user to create a pour', function() {
      this.server.respondWith('POST', '/api/pours',
        [200, { 'Content-Type': 'application/json' },
          JSON.stringify(__fixture('pours-create'))]);
      this.server.respondWith('GET', '/api/pour',
        [200, { 'Content-Type': 'application/json' },
          JSON.stringify(__fixture('pours'))]);
      visit('/');
      fillIn('input.postBox', 'LOOK AT ME!!!!!');
      click('button[name="submit"]');
      andThen(function() {
        expect(find('ul.pours li:last').text()).to.eql('');
      });
      // TODO: make sure the requests that the client side ember data
      // stuff is making actually match the fixtures. this was partially
      // done above with the home page, but more expecations will be
      // needed for post requests to ensure that the body matches with
      // the fixture json (body).
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

