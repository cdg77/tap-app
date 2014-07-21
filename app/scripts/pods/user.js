'use strict';

module.exports = function(TapApp) {

  TapApp.User = DS.Model.extend({
    username: DS.attr('string'),
    password: DS.attr('string')
  });
};