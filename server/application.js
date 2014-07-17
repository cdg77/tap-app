'use strict';

var _ = require('lodash');
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
  Pour
  .query(function(q) { q.orderBy('timeOfPour'); })
  .fetchAll().then(function(collection) {
    res.json({
      'pours': collection.toJSON()
    });
  }).done();
});

api.get('/users/:id/pours', function(req, res) {
  Pour
  .where({ userID: req.params.id })
  .query(function(q) { q.orderBy('timeOfPour'); })
  .fetchAll().then(function(collection) {
    res.json({
      'pours': collection.toJSON()
    });
  }).done();
});


// all routes defined from here on will require authorization
api.use(admit.authorize);
api.delete('/sessions/current', admit.invalidate, function(req, res) {
  if (req.auth.user) { throw new Error('Session not invalidated.'); }
  res.json({ status: 'ok' });
});

api.get('/users', function(req, res) {
  var query = {};
  console.log('%j', req.params.current);
  if (req.query.current === 'true') {
    // TODO: request that admit-one allows us to do authenticated or non-authenticated
    // middleware so that this can exist for non-authenticated users
    query.id = req.auth.user.id;
  }
  
  User
  .where(query)
  .fetchAll().then(function(collection) {
    res.json({
      'users': collection.toJSON().map(function(user) {
        // TODO: remove passwordDigest & other stuff
        return _.merge(user, {
          links: {
            pours: '/api/users/' + user.id + '/pours'
          }
        });
      })
    });
  }).done();
});

api.post('/pours', function(req, res) {
  var pourAttributes = _.pick(req.body.pour, 'brewery', 'beerName', 'venue', 'beerRating');
  pourAttributes.userID = req.auth.user.id;
  Pour.forge(pourAttributes).save()
  .then(function(pour) {
    res.json({ 'pour': pour.toJSON() });
  }).done();
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
