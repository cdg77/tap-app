'use strict';

module.exports = function(TapApp) {

  TapApp.AddPourRoute = Ember.Route.extend({
    model: function() {
      return this.store.createRecord('pour');
    },

    actions: {
      willTransition: function(transition) {
        var model = this.get('controller.model');
        if (model.get('isNew')) {
          model.destroyRecord();
        }
        return true;
      }
    }
  });

  TapApp.AddPourController = Ember.ObjectController.extend({
    isRating1: function() {
      return parseInt(this.get('model.beerRating')) === 1;
    }.property('beerRating'),

    isRating2: function() {
      return parseInt(this.get('model.beerRating')) === 2;
    }.property('beerRating'),

    isRating3: function() {
      return parseInt(this.get('model.beerRating')) === 3;
    }.property('beerRating'),

    isRating4: function() {
      return parseInt(this.get('model.beerRating')) === 4;
    }.property('beerRating'),

    isRating5: function() {
      return parseInt(this.get('model.beerRating')) === 5;
    }.property('beerRating'),

    actions: {
      post: function() {
        var self = this;
        this.get('model').save().then(function() {
          self.transitionToRoute('index');
        });
      },
      choose1: function() {
        this.set('model.beerRating', 1);
      },
      choose2: function() {
        this.set('model.beerRating', 2);
      },
      choose3: function() {
        this.set('model.beerRating', 3);
      },
      choose4: function() {
        this.set('model.beerRating', 4);
      },
      choose5: function() {
        this.set('model.beerRating', 5);
      }
    }
  });
};
