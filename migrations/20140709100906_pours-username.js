'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('pours', function(table) {
    table.integer('userID').notNullable().references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('pours', function(table) {
    table.dropColumn('userID');
  });
};
