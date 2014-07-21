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
    }.property('beerRating'),
    isNewPour: function() {
      var timeOfPour = this.get('timeOfPour');
      var oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      if(timeOfPour >= oneDayAgo) {
        return true;
      } else {
        return false;
      }
    }.property('timeOfPour'),
    isOldPour: function() {
      var timeOfPour = this.get('timeOfPour');
      var threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      if(timeOfPour < threeDaysAgo) {
        return true;
      } else {
        return false;
      }
  }.property('timeOfPour')

  });
};
