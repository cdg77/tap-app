'use strict';

module.exports = function(TapApp) {
// authenticate any route
  TapApp.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
    model: function() {
      // TODO: can we send { user: 'current' } instead? not yet. you'd need
      // some features to be added to admit-one.
      var promises = {
        pours: this.store.find('pour', { user: this.get('session.id') }),
        user: this.store.find('user', this.get('session.id'))
      }
      return new Ember.RSVP.hash(promises);
    }
  });

  TapApp.ProfileController = Ember.ObjectController.extend({
    // lookupItemController: function(object) {
    //   console.log(object);
    //   if (object) {
    //     return 'pour';
    //   } else {
    //     return 'user';
    //   }
    // },
    itemController: 'pour',
    sortProperties: ['timeOfPour'],
    sortAscending: false
  });
};
