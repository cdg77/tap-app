'use strict';

describe('app', function() {
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

  it('will allow logged-in user to create a pour', function() {
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



  it.skip('will display ', function() {});


  it.skip('will have more tests');
});

