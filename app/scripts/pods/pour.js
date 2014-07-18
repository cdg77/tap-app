'use strict';

module.exports = function(TapApp) {

  TapApp.Pour = DS.Model.extend({
    brewery: DS.attr('string'),
    beerName: DS.attr('string'),
    venue: DS.attr('string'),
    beerRating: DS.attr('number'),
    timeOfPour: DS.attr('date')
  });
  TapApp.PourController = Ember.ObjectController.extend({
    ratingDescriptor: function() {
      var beerRating = this.get('beerRating');
      var choices = {
        1: 'Undrinkable',
        2: 'Disappointing',
        3: 'Solid',
        4: 'Great',
        5: 'Awesome'
      };
      return choices[beerRating];
    }.property('beerRating')
  });
};