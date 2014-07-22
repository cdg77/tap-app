'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('displayName');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('displayName');
  });
};
