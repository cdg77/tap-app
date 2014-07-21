'use strict';

window.TapApp = Ember.Application.create();
TapApp.AdmitOneContainers = {}; // overridable by tests
Ember.AdmitOne.setup({ containers: TapApp.AdmitOneContainers });

TapApp.Router.map(function() {
  this.route('signup');
  this.route('login');
  this.route('logout');
  this.route('profile');
  this.route('addPour');
});

require('./pods/add-pour.js')(TapApp);
require('./pods/index.js')(TapApp);
require('./pods/login.js')(TapApp);
require('./pods/logout.js')(TapApp);
require('./pods/pour.js')(TapApp);
require('./pods/profile.js')(TapApp);
require('./pods/signup.js')(TapApp);
require('./pods/user.js')(TapApp);

TapApp.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// https://github.com/twbs/bootstrap/issues/9013
$(document).on('click.nav', '.navbar-collapse.in', function(e) {
  if($(e.target).is('a') || $(e.target).is('button')) {
    $(this).collapse('hide');
  }
});

TapApp.ProfileRoute = Ember.Route.extend({
  model: function() {
    // TODO: can we send { user: 'current' } instead? not yet. you'd need
    // some features to be added to admit-one.
    return this.store.find('pour', { user: this.get('session.id') });
  }
});

TapApp.FocusInputComponent = Ember.TextField.extend({
  becomeFocused: function() {
    this.$().focus();
  }.on('didInsertElement')
});
