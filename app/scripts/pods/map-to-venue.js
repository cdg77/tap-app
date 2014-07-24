'use strict';

module.exports = function(TapApp) {
// authenticate any route
  TapApp.MapToVenueRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
  });

  TapApp.MapToVenueRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('venue');
    }
  });

  TapApp.MapToVenueController = Ember.ArrayController.extend({
    itemController: 'pour',
    sortProperties: ['timeOfPour'],
    sortAscending: false
  });
};
