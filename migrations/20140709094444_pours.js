'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('pours', function(table) {
    table.increments('id').primary();
    table.string('brewery').notNullable();
    table.string('beerName').notNullable();
    table.string('venue').notNullable();
    table.integer('beerRating');
    table.timestamp('timeOfPour').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pours');
};
