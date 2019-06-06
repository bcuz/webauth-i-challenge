const db = require('./dbConfig.js');

module.exports = {
  get,
  add,
  findBy,
  findById
};

function get() {
  return db('users');
}

function add(user) {
  return db('users')
  .insert(user)
  .then(ids => {
    return findById(ids[0])
  });
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}