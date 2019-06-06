const db = require('./dbConfig.js');

module.exports = {
  get
};

function get() {
  return db('users');
}