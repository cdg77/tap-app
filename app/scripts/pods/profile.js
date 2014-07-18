'use strict';

module.exports = function(TapApp) {
// authenticate any route
  TapApp.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
  });

  TapApp.ProfileRoute = Ember.Route.extend({
    model: function() {
      // TODO: can we send { user: 'current' } instead? not yet. you'd need
      // some features to be added to admit-one.
      return this.store.find('pour', { user: this.get('session.id') });
    }
  });

  TapApp.ProfileController = Ember.ArrayController.extend({
    itemController: 'pour',
    sortProperties: ['timeOfPour'],
    sortAscending: false
  });
};
