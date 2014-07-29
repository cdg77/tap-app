'use strict';

module.exports = function(TapApp) {

  TapApp.AutocompleteController = Ember.ObjectController.extend({
    itemController: 'pour.brewery',
    userInput: null,
        //stores names of breweries after server responds
    allBreweryNames: [],
    requestMatchingBreweries: function() {
      var userInput = this.get('userInput');
      var self = this;
      this.makeAsyncHTTPRequest(userInput).then(function(newBreweries) {
        console.log(newBreweries);
        self.handleNewBreweries(newBreweries);
      });

      //requests breweries with names matching user input per
      //defined criteria

    }.observes('userInput'),

    handleNewBreweries: function(newBreweries) {
      //routes brewery names to allBreweryNames
      console.log('handling new breweries');
      var allBreweryNames = this.get('allBreweryNames')
        .concat(newBreweries);
      this.set('allBreweryNames', allBreweryNames);
      console.log('allBreweryNames:' + allBreweryNames);
    },
    breweryNames: function() {
      var userInput = this.get('userInput');
      console.log('LOG1:' + userInput);
      if(!userInput) { return []; }
      var regex = new RegExp(userInput, 'i');

      return this.get('allBreweryNames').filter(function(name) {
        console.log('LOG3:' + name);
        return name.match(regex);
      });
    }.property('userInput', 'allBreweryNames'),
    isMatch: function() {
      var breweryNames = this.get('breweryNames');
      if(breweryNames.length >= 1) { return true; }
    }.property('breweryNames')
  });


  // dear sam, this is code that you should not worry about.
  TapApp.AutocompleteController.reopen({

    makeAsyncHTTPRequest: function(userInput) {
      var data = [];
      var duration = 0;
      if (userInput.match(/[a-j]/i)) {
        console.log('getting real names');
        data = ['Elysian', 'Bridgeport', 'Breakside'];
        duration = 300;
      }
      else if (userInput.match(/[j-r]/i)) {
        console.log('getting people names');
        data = ['Sam', 'Whit'];
        duration = 500;
      }
      else if (userInput.match(/[r-z]/i)) {
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
