'use strict';

module.exports = function(TapApp) {

  TapApp.EditProfileRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('user', this.get('session.id'));
    }
  });

  TapApp.EditProfileController = Ember.ObjectController.extend({
    actions: {
      post: function() {
        var self = this;
        this.get('model').save().then(function() {
          self.transitionToRoute('profile');
        });
      }
    }
  });
};
