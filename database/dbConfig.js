const knex = require('knex');

const configOptions = require('../knexfile')[process.env.NODE_ENV || 'development'];

module.exports = knex(configOptions);