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

TapApp.IndexController = Ember.ArrayController.extend({
  sortProperties: ['timeOfPour'],
  sortAscending: false
});

TapApp.Pour = DS.Model.extend({
  brewery: DS.attr('string'),
  beerName: DS.attr('string'),
  venue: DS.attr('string'),
  beerRating: DS.attr('number'),
  timeOfPour: DS.attr('date')
});

TapApp.User = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string'),
  pours: DS.hasMany('pour', { async: true })
});

TapApp.LoginRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('index');
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
          self.transitionToRoute('index');
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
        self.transitionToRoute('index');
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
  },

  actions: {
    willTransition: function(transition) {
      var model = this.get('controller.model');
      if (model.get('isNew')) {
        model.destroyRecord();
      }
      return true;
    }
  }
});

TapApp.AddPourController = Ember.ObjectController.extend({
  isRating1: function() {
    return parseInt(this.get('model.beerRating')) === 1;
  }.property('beerRating'),

  isRating2: function() {
    return parseInt(this.get('model.beerRating')) === 2;
  }.property('beerRating'),

  isRating3: function() {
    return parseInt(this.get('model.beerRating')) === 3;
  }.property('beerRating'),

  isRating4: function() {
    return parseInt(this.get('model.beerRating')) === 4;
  }.property('beerRating'),

  isRating5: function() {
    return parseInt(this.get('model.beerRating')) === 5;
  }.property('beerRating'),

  actions: {
    post: function() {
      var self = this;
      this.get('model').save().then(function() {
        self.transitionToRoute('index');
      });
    },
    choose1: function() {
      this.set('model.beerRating', 1);
    },
    choose2: function() {
      this.set('model.beerRating', 2);
    },
    choose3: function() {
      this.set('model.beerRating', 3);
    },
    choose4: function() {
      this.set('model.beerRating', 4);
    },
    choose5: function() {
      this.set('model.beerRating', 5);
    }
  }
});

TapApp.ProfileRoute = Ember.Route.extend({
  model: function() {
    var user;
    return this.store.find('user', { current: true }).then(function(users) {
      user = users.objectAt(0);
      return user.get('pours');
    }).then(function(pours) {
      return user;
    });
    // return [];

      // return this.store.find('pour', { userID : 7 });
  }
});

TapApp.ProfileController = Ember.ObjectController.extend({
});


