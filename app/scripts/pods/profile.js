'use strict';

module.exports = function(TapApp) {
// authenticate any route
  TapApp.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
    model: function() {
      // TODO: can we send { user: 'current' } instead? not yet. you'd need
      // some features to be added to admit-one.

      var poursController = this.get('container').lookup('controller:profile-pours');
      var wrapPoursWithController = function(pours) {
        poursController.set('content', pours);
        return poursController;
      };
      var pours = this.store.find('pour', { user: this.get('session.id') });
      var user = this.store.find('user', this.get('session.id'));
      return new Ember.RSVP.hash({
        pours: pours.then(wrapPoursWithController),
        user: user
      });
    }
  });

  TapApp.ProfilePoursController = Ember.ArrayController.extend({
    itemController: 'pour',
    sortProperties: ['timeOfPour'],
    sortAscending: false
  });
};
