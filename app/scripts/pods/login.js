'use strict';

module.exports = function(TapApp) {

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
};
