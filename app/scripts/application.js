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
});

require('./pods/autocomplete.js')(TapApp);

require('./pods/add-pour.js')(TapApp);
require('./pods/edit-profile.js')(TapApp);
require('./pods/index.js')(TapApp);
require('./pods/login.js')(TapApp);
require('./pods/logout.js')(TapApp);
require('./pods/pour.js')(TapApp);
require('./pods/profile.js')(TapApp);
require('./pods/signup.js')(TapApp);
require('./pods/user.js')(TapApp);

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
(function() {
  google.maps.event.addDomListener(window, 'load', function() {
    var mapOptions = {
      center: new google.maps.LatLng(45.5312541,-122.6670392),
      zoom: 12
    };

    // TODO: this timeout waits a second to ensure that the template has been
    // rendered before displaying the map. eventually, this code will probably
    // move elsewhere, so it shouldn't matter.
    setTimeout(function() {
      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
    }, 1000);
  });
})();
