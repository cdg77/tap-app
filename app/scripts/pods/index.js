'use strict';

module.exports = function(TapApp) {

  TapApp.IndexRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('pour');
    }
  });

  TapApp.IndexController = Ember.ArrayController.extend({
    itemController: 'pour',
    sortProperties: ['timeOfPour'],
    sortAscending: false
  });
};
