'use strict';

module.exports = function(TapApp) {
  TapApp.AutocompleteController = Ember.ObjectController.extend({
    brewery: null,
    breweryNames: function() {
      var brewery = this.get('brewery');
      if(!brewery) { return; }
      var regex = RegExp(brewery, 'i');
      return ['Cigar City', 'Crux', 'Captain', 'Carlo', 'Caravan'].filter(function(name) {
        return name.match(regex);
      });
    }.property('brewery')
  });
};
