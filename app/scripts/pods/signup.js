'use strict';

module.exports = function(TapApp) {

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
};
