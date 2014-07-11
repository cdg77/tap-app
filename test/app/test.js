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

	describe('when on profile page', function() {
		beforeEach(function() {
			visit('/profile');
		});

	  it('lets the user move from profile to addPour', function() {
    	click('button[name="create-pour"] a');
    	andThen(function() {
      	expect(currentRouteName()).to.eql('pour.create');
      	expect(currentPath()).to.eql('pour.create');
      	expect(currentURL()).to.eql('/pour/create');
    	});
  	});
	});
});
