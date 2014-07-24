'use strict';

var respondWith = function(server, fixture) {
  var req = fixture.request;
  var res = fixture.response;
  var headers = Ember.$.extend({ 'Content-Type': 'application/json' },
    res.headers);
  server.respondWith(req.method, req.url,
    [res.status, headers, JSON.stringify(res.json)]);
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
        id: 7,
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

      it('has fake google map expectations', function() {
        expect(google.maps.Map.called).to.be.true;
        expect(google.maps.Map.callCount).to.eql(1);
        expect(google.maps.Map.getCall(0).args[1]).to.eql({ center: {}, zoom: 12 });
      });

      it('displays the pour rating with a human friendly message', function() {
        expect(find('ul.pours li:nth-of-type(1) span.beerRating').text().trim()).to.eql('Solid');
        expect(find('ul.pours li:nth-of-type(2) span.beerRating').text().trim()).to.eql('Great');
        expect(find('ul.pours li:nth-of-type(3) span.beerRating').text().trim()).to.eql('Great');
      });

      it('will not display empty pours after visiting addPour', function() {
        click('a.addPour');
        click('a.index');
        andThen(function() {
          expect(find('ul.pours li').length).to.eql(3);
        });
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
      click('button.rating' + this.fixture.request.json.pour.beerRating);
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

    it.skip('allows user to customize profile', function() {
      this.fixture = __fixture('user-update');
      respondWith(this.server, __fixture('user-existing'));
      visit('/editProfile');
      fillIn('input.displayName', this.fixture.request.json.user.displayName);
      fillIn('input.bio', this.fixture.request.json.user.bio);
      click('button[type="submit"]');
      andThen(function() {
        // expect(this.server.requests.length).to.eql(3);
        expect(this.server.requests[1].method).to.eql(this.fixture.request.method);
        expect(this.server.requests[1].url).to.eql(this.fixture.request.url);
        expect(this.server.requests[1].requestHeaders).to.contain(this.fixture.request.headers);
        console.log(JSON.parse(this.server.requests[1].requestBody));
        console.log(this.fixture.request.json);
        // expect(JSON.parse(this.server.requests[1].requestBody)).to.eql(this.fixture.request.json);
        expect(currentRouteName()).to.eql('profile');
        // expect(currentPath()).to.eql('profile');
        // expect(currentURL()).to.eql('profile');
      }.bind(this));
    });

    //TODO: Test to see that non-authenticated user can't add pour
    describe('when on profile page', function() {
      beforeEach(function() {
        this.fixture = __fixture('pours-by-profile');
        respondWith(this.server, this.fixture);
        visit('/profile');
      });

      it('displays all posts by that user on their profile page', function() {
        expect(find('ul.pours li').length).to.eql(4);
      });

      it.skip('lets the user move to editProfile', function() {
        click('button.edit-profile');
        andThen(function() {
          expect(currentRouteName()).to.eql('editProfile');
          expect(currentPath()).to.eql('editProfile');
          expect(currentURL()).to.eql('/editProfile');
        });
      });

      it('lets the user move from profile to addPour', function() {
        click('a.addPour');
        andThen(function() {
          expect(currentRouteName()).to.eql('addPour');
          expect(currentPath()).to.eql('addPour');
          expect(currentURL()).to.eql('/addPour');
        });
      });
    });
    describe('when you add a pour', function() {
      beforeEach(function() {
        this.fixture = __fixture('pours-three');
        respondWith(this.server, this.fixture);
        visit('/addPour');
      });
      it.skip('will autocomplete common brewery names', function() {
        this.fixture = __fixture('pour-add');
        respondWith(this.server, this.fixture);
        respondWith(this.server, __fixture('pours-three'));
        visit('/addPour');
        keyEvent('input.brewery', 'keypress', 67);
        keyEvent('input.brewery', 'keypress', 40);
        keyEvent('input.brewery', 'keypress', 13);
        fillIn('input.beerName', this.fixture.request.json.pour.beerName);
        fillIn('input.venue', this.fixture.request.json.pour.venue);
        click('button.rating' + this.fixture.request.json.pour.beerRating);
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
      var fixture = __fixture('user-signup');
      click('a.login');
      click('a.signup');
      respondWith(this.server, fixture);

      fillIn('input[type="username"]', fixture.request.json.user.username);
      fillIn('input[type="password"]', fixture.request.json.user.password);
      click('button[type="submit"]');
      andThen(function() {
        expect(currentRouteName()).to.eql('index');
        expect(currentPath()).to.eql('index');
        expect(currentURL()).to.eql('/');
      });
    });
  });
});
