'use strict';

module.exports = function(TapApp) {

  TapApp.AutocompleteController = Ember.ObjectController.extend({
    itemController: 'pour.brewery',
    brewery: null,
    allBreweryNames: [],
      //stores names of breweries after server responds

    requestMatchingBreweries: function() {
      var brewery = this.get('brewery');
      var self = this;
      this.makeAsyncHTTPRequest(brewery).then(function(newBreweries) {
        self.handleNewBreweries(newBreweries);
      });

      //requests breweries with names matching user input per
      //defined criteria

    },
    handleNewBreweries: function(newBreweries) {
      //routes brewery names to allBreweryNames
    },
    breweryNames: function() {
      var brewery = this.get('brewery');
      console.log('LOG1:' + brewery);
      if(!brewery) { return []; }
      var regex = new RegExp(brewery, 'i');

      return this.get('allBreweryNames').filter(function(name) {
        console.log('LOG3:' + name);
        return name.match(regex);
      });
    }.property('brewery', 'allBreweryNames'),
    isMatch: function() {
      var breweryNames = this.get('breweryNames');
      if(breweryNames.length >= 1) { return true; }
    }.property('breweryNames')
  });


  // dear sam, this is code that you should not worry about.
  TapApp.AutocompleteController.reopen({

    makeAsyncHTTPRequest: function(brewery) {
      var data = [];
      var duration = 0;
      if (brewery.match(/[a-j]/i)) {
        console.log('getting real names');
        data = ['Elysian', 'Bridgeport'];
        duration = 300;
      }
      else if (brewery.match(/[j-r]/i)) {
        console.log('getting people names');
        data = ['Sam', 'Whit'];
        duration = 500;
      }
      else if (brewery.match(/[r-z]/i)) {
        console.log('getting letter based names');
        data = ['RR', 'SS', 'TT', 'UU', 'VV', 'WW', 'XX', 'YY', 'ZZ'];
        duration = 2000;
      }

      return new Ember.RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve(data);
        }, duration);
      });
    }
  });

};
