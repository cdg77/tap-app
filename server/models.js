'use strict';

var config = require('./config');
var knexConfig = require('./config/knexfile')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Pours;

User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});

Pours = bookshelf.Model.extend({
  tableName: 'Pours'
});

module.exports = {
  User: User,
  Token: Token,
  Pours: Pours
};

