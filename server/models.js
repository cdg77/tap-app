'use strict';

var config = require('./config');
var knexConfig = require('./config/knexfile')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Pour;
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  pours: function() {
    return this.hasMany(Pour);
  },
    tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});

Pour = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  hasTimestamps: ['timeOfPour'],
  tableName: 'pours'
});

module.exports = {
  User: User,
  Token: Token,
  Pour: Pour
};

