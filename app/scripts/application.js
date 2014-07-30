'use strict';

window.TapApp = Ember.Application.create();
TapApp.AdmitOneContainers = {}; // overridable by tests
Ember.AdmitOne.setup({ containers: TapApp.AdmitOneContainers });

TapApp.Router.map(function() {
  this.route('signup');
  this.route('login');
  this.route('logout');
  this.route('profile');
  this.route('addPour');
  this.route('editProfile');
  this.route('mapToVenue');
});

require('./pods/autocomplete.js')(TapApp);

require('./pods/add-pour.js')(TapApp);
require('./pods/edit-profile.js')(TapApp);
require('./pods/index.js')(TapApp);
require('./pods/login.js')(TapApp);
require('./pods/logout.js')(TapApp);
require('./pods/map-to-venue.js')(TapApp);
require('./pods/pour.js')(TapApp);
require('./pods/profile.js')(TapApp);
require('./pods/signup.js')(TapApp);
require('./pods/user.js')(TapApp);
require('./pods/map-to-venue.js')(TapApp);

TapApp.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

TapApp.ApplicationRoute = Ember.Route.extend({
  renderTemplate: function() {
    this._super();
    Ember.run.schedule('afterRender', function() {
      if (window.twttr) {
        window.twttr.widgets.load();
      }
    });
  }
});

// https://github.com/twbs/bootstrap/issues/9013
$(document).on('click.nav', '.navbar-collapse.in', function(e) {
  if($(e.target).is('a') || $(e.target).is('button')) {
    $(this).collapse('hide');
  }
});

TapApp.ProfileRoute = Ember.Route.extend({
  model: function() {
    // TODO: can we send { user: 'current' } instead? not yet. you'd need
    // some features to be added to admit-one.
    return this.store.find('pour', { user: this.get('session.id') });
  }
});

TapApp.FocusInputComponent = Ember.TextField.extend({
  becomeFocused: function() {
    this.$().focus();
  }.on('didInsertElement')
});

// TODO: replace 0000000000000000 app id below
// Facebook Button
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0&appId=0000000000000000';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Twitter Button
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if(!d.getElementById(id)){
    js = d.createElement(s);
    js.id = id;
    js.src='https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
  }
}(document,'script','twitter-wjs'));

// Google+ Button
(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

// Google Map
(function(google) {

  google.maps.event.addDomListener(window, 'load', function() {
    var mapOptions = {
      center: new google.maps.LatLng(45.5312541,-122.6670392),
      zoom: 12
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      /* jshint camelcase: false */
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      /* jshint camelcase: true */

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
    });

    // setTimeout(function() {
    //   var map = new google.maps.Map(document.getElementById('map-canvas'),
    //       mapOptions);
    //   marker.setMap(map);
    // }, 1000);
  });
})(window.google);

