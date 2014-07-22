'use strict';

module.exports = function(TapApp) {
  TapApp.AutocompleteController = Ember.ObjectController.extend({
    brewery: null,
    breweryNames: function() {
      var brewery = this.get('brewery');
      if(!brewery) { return; }
      return ['Cigar City'].filter(function(name) {
        return name.match(brewery);
      });
    }.property('brewery')

  });
};
