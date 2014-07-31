'use strict';


Ember.LOG_VERSION = false;
Ember.testing = true;
Ember.Application.reopen({
  init: function() {
    this._super();
    this._setupTestApplication();
  },

  _setupTestApplication: function() {
    var testingElementID = 'ember-test-application';
    this.rootElement = '#' + testingElementID;
    this.setupForTesting();
    this.injectTestHelpers();
    Ember.$('body').append(Ember.$('<div id="' + testingElementID + '"/>'));
  }
});

// test helpers
Ember.Test.registerHelper('applicationContainer', function(app) {
  return app.__container__;
});

// use ephemeral store for authentication data
Ember.Application.initializer({
  name: 'authentication-test',
  initialize: function(container, application) {
    var Ephemeral = Ember.AdmitOne.Storage.Base.extend({
      data: null,
      persist: function(data) { this.set('data', data); },
      restore: function() { return this.get('data'); },
      clear: function() { this.set('data'); }
    });
    application.register('auth-session-storage:ephemeral', Ephemeral);
    application.register('auth-session-storage:test', Ephemeral);
    TapApp.AdmitOneContainers.storage = 'auth-session-storage:test';
  }
});

// expose fixtures property (stored in __html__ via karma preprocessor)
window.__fixture = function(name) {
  var fixture = window.__html__['test/fixtures/' + name + '.json'];
  if (!fixture) { throw new Error('Missing fixture ' + name); }
  return JSON.parse(fixture);
};


//This is a workaround for bind incompatibility with Phantomjs
//https://github.com/ariya/phantomjs/issues/10522
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


Ember.Application.initializer({
  name: 'google-stubs',
  initialize: function(container, application) {
    var google = window.google = {};
    google.maps = {};
    google.maps.MapTypeId = {
      ROADMAP: 'roadmap'
    };
    google.maps.Animation = {
      DROP: 'drop'
    };
    google.stubs = {};
    google.stubs.map = {};
    google.stubs.maps = {};
    google.stubs.map.fitBounds = sinon.stub();
    google.stubs.marker = {};
    google.stubs.marker.setMap = sinon.stub();
    google.stubs.marker.setPosition = sinon.stub();
    google.stubs.marker.setVisible = sinon.stub().returns(true);
    google.stubs.event = {};
    google.stubs.event.latLng = {};
    google.stubs.event.latLng.lat = sinon.stub().returns(45.5328930);
    google.stubs.event.latLng.lng = sinon.stub().returns(-122.6892520);
    google.stubs.place = {};
    google.stubs.place.geometry = {
      viewport: '???',
      location: '???'
    };
    google.stubs.autocomplete = {};
    google.stubs.autocomplete.getPlace = sinon.stub().returns(google.stubs.place);
    google.maps.LatLng = sinon.stub();
    google.maps.Map = sinon.stub().returns(google.stubs.map);
    google.maps.Marker = sinon.stub().returns(google.stubs.marker);
    google.maps.event = {};
    google.maps.event.addListener = sinon.stub().callsArgWithAsync(2, google.stubs.event);
    google.maps.places = {};
    google.maps.places.Autocomplete = sinon.stub().returns(google.stubs.autocomplete);
    google.maps.Point = {};
    google.maps.Point = sinon.stub();
  }
});
// terrible hack from https://github.com/ariya/phantomjs/issues/10522
// this is required to fix bind on phantomjs
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

