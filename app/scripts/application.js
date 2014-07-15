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

TapApp.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// authenticate any route
TapApp.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
});

TapApp.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('pour');
  }
});

TapApp.Pour = DS.Model.extend({
  brewery: DS.attr('string'),
  beerName: DS.attr('string'),
  venue: DS.attr('string'),
  beerRating: DS.attr('number')
});

TapApp.ProfileController = Ember.ObjectController.extend({


});

TapApp.User = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string')
});

TapApp.LoginRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('profile');
    }
  }
});

TapApp.LoginController = Ember.Controller.extend({
  actions: {
    authenticate: function() {
      var self = this;
      var session = this.get('session');
      var credentials = this.getProperties('username', 'password');
      this.set('error', undefined);
      this.set('password', undefined);
      session.authenticate(credentials).then(function() {
        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          self.set('attemptedTransition', null);
        } else {
          self.transitionToRoute('profile');
        }
      })
      .catch(function(error) {
        self.set('error', error);
      });
    }
  }
});

TapApp.LogoutRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    var self = this;
    var session = this.get('session');
    return session.invalidate().finally(function() {
      self.transitionTo('index');
    });
  }
});

TapApp.SignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('user');
  }
});

TapApp.SignupController = Ember.ObjectController.extend({
  actions: {
    signup: function() {
      var session = this.get('session');
      var self = this;

      this.set('error', undefined);
      this.get('model').save() // create the user
      .then(function() {
        session.login({ username: self.get('model.username') });
        self.transitionToRoute('profile');
      })
      .catch(function(error) {
        if (error.responseJSON) { error = error.responseJSON; }
        if (error.error) { error = error.error; }
        self.set('error', error);
      });
    }
  }
});

TapApp.AddPourRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('pour');
  }
});

TapApp.AddPourController = Ember.ObjectController.extend({
  actions: {
    post: function() {
      var self = this;
      this.get('model').save().then(function() {
        self.transitionToRoute('index');
      });
    }
  }
});

