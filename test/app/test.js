'use strict';

describe('TapApp', function() {

  beforeEach(function() {
    var container = applicationContainer();
    var session = container.lookup('auth-session:main');
    session.set('content', {
      username: 'fake-username',
      token: 'fake-token'
    });
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  });

  afterEach(function() {
    this.server.restore();
    TapApp.reset();
  });

  it('will display pours', function() {
    this.server.respondWith('GET', '/api/pours',
      [200, { 'Content-Type': 'application/json' },
        JSON.stringify(__fixture('pours-three').response.json)]);
    visit('/');
    andThen(function() {
      expect(find('ul.pours li').length).to.eql(3);
      console.log();
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

