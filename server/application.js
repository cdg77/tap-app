'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();
var api = express.Router();

var models = require('./models'),
    User = models.User,
    Pour = models.Pour,
    Token = models.Token;

var admit = require('admit-one')('bookshelf', {
  bookshelf: { modelClass: User }
});

app.use(require('body-parser').json());

api.post('/users', admit.create, function(req, res) {
  // user representations accessible via
  // req.auth.user & req.auth.db.user
  res.json({ user: req.auth.user });
});

api.post('/sessions', admit.authenticate, function(req, res) {
  // user accessible via req.auth
  res.json({ session: req.auth.user });
});

api.get('/pours', function(req, res) {
  Pour.fetchAll().then(function(collection) {
    res.json({
      'pours': collection.toJSON()
    });
  }).done();
});

api.post('/pours', function(req, res) {
  res.json({
    'pour': {
      'id': 1,
      'brewery': 'brewer',
      'beerName': 'beer',
      'venue': 'bar',
      'timestamp': 6000000,
      'userID': 1
    // }, {
    //   'id': 2,
    //   'brewery': 'brewer2',
    //   'beerName': 'beer2',
    //   'venue': 'bar',
    //   'timestamp': 6006500,
    //   'userID': 1
    }
  });
});

// all routes defined from here on will require authorization
api.use(admit.authorize);
api.delete('/sessions/current', admit.invalidate, function(req, res) {
  if (req.auth.user) { throw new Error('Session not invalidated.'); }
  res.json({ status: 'ok' });
});

// application routes
app.use('/api', api);

if (config.env === 'development') {
  var connectLivereload = require('connect-livereload');
  app.use(connectLivereload({ port: process.env.LIVERELOAD_PORT || 35729 }));
  app.use(morgan('dev'));
  app.use(express.static(config.public));
  app.use(express.static(path.join(__dirname, '../app')));
}
if (config.env === 'production') {
  app.use(morgan('default'));
  app.use(favicon(path.join(config.public, 'favicon.ico')));
  app.use(express.static(config.public));
  app.use(compression());
}
app.use(bodyParser.json());
app.use(methodOverride());

// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}
