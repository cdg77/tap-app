'use strict';

var mocha = require('mocha');
var models = require('../server/models');
var disconnect = function() {
  models._knex.client.pool.destroy();
};

// hook into mocha to figure out when all tests are finished running
(function(run) {
  mocha.Runner.prototype.run = function() {
    var args = Array.prototype.slice.call(arguments);
    var cb = args[0]; args[0] = function() {
      cb.apply(this, arguments);
      disconnect();
    };
    return run.apply(this, args);
  };
}(mocha.Runner.prototype.run));
