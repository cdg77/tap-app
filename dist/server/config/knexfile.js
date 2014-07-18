'use strict';

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      host     : process.env.APP_DB_HOST     || '127.0.0.1',
      user     : process.env.APP_DB_USER     || '',
      password : process.env.APP_DB_PASSWORD || '',
      database : process.env.APP_DB_NAME     || 'tap-app'
    }
  },

  // NODE_ENV='test' ./node_modules/.bin/knex migrate:latest
  test: {
    client: 'postgres',
    connection: {
      database : 'tap-app-test'
    }
  },

  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  }
};
