'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _conf = require('../conf/conf');

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// construct DB_URL
/*
 * Des��mongoose-client to make mongodb CRUD more convenient.
 * Author��njhxzhangjh@gmail.com
 * Date��10/14/2017
 * Ver��1.0
 * */
var DB_URL = "mongodb://" + _conf2.default.db.DB_IP + ":" + _conf2.default.db.DB_PORT + "/" + _conf2.default.db.DB_NAME;
console.log("DB_URL: " + DB_URL);

//define schema
function defineSchema(collection) {
  var schema = _conf2.default.schema;
  for (var key in schema) {
    if (schema.hasOwnProperty(key) && key === collection) {
      return new _mongoose2.default.Schema(schema[key]);
    }
  }
}

// connect to mongodb
function connect(collection, cb) {
  var db = _mongoose2.default.createConnection(DB_URL);
  db.on('error', function (e) {
    return console.error(e);
  });

  db.once('open', function () {
    var tableSchema = defineSchema(collection);
    // deploy schema to model
    var tableModel = db.model(collection, tableSchema);
    if (!db.model(collection)) {
      return console.error("model list deploy failed!");
    }

    if (cb) cb(db, tableModel);
  });
}

//insert
var insert = function insert(collection, data, callback) {
  connect(collection, function (db, tableModel) {
    var mongoEntity = new tableModel(data);
    mongoEntity.save(function (e) {
      db.close();
      if (e) callback({ status: false, msg: e });else callback({ status: true });
    });
  });
};

//find
var find = function find(collection, findPattern, callback) {
  connect(collection, function (db, tableModel) {
    tableModel.find(findPattern).exec(function (e, res) {
      db.close();
      if (e) callback({ status: false, msg: e });else callback({ status: true, data: res });
    });
  });
};

//update
var update = function update(collection, updateCondition, _update, options, callback) {
  connect(collection, function (db, tableModel) {
    tableModel.find(updateCondition, function (e, res) {
      if (e) {
        callback({ status: false, msg: e });
      }
      if (res) {
        tableModel.update(updateCondition, _update, options, function (e) {
          db.close();
          if (e) callback({ status: false, msg: e });else callback({ status: true });
        });
      }
      callback({ status: false, msg: "Update error: No this data exist." });
    });
  });
};

//remove
var remove = function remove(collection, removeCondition, callback) {
  connect(collection, function (db, tableModel) {
    tableModel.find(removeCondition, function (e, res) {
      if (e) {
        callback({ status: false, msg: e });
      }
      if (res) {
        tableModel.remove(removeCondition, function (e) {
          db.close();
          if (e) callback({ status: false, msg: e });else callback({ status: true });
        });
      }
      callback({ status: false, msg: "Remove error: No this data exist." });
    });
  });
};

exports.mongooseClient = {
  insert: insert,
  update: update,
  remove: remove,
  find: find
};