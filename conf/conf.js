// You must modify this DB config to your own
let db = {
    DB_IP: "127.0.0.1",
    DB_PORT: "27017",
    DB_NAME: "Test"
  };

// You must define collection schema first
let schema = {
    collection1: {
      key1: {type: String},
      key2: {type: String}
    },
    collection2: {
      key1: {type: String},
      key2: {type: JSON},
      key3: {type: Array}
    }
  };

module.exports = {
  db,
  schema
};