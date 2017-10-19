'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _conf = require('../conf/conf');

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Des��mongoose-client to make mongodb CRUD more convenient.
 * Author��njhxzhangjh@gmail.com
 * Date��10/14/2017
 * Ver��1.0
 * */
var mongooseClient = function mongooseClient(params) {
  this.DB_IP = params.DB_IP || _conf2.default.db.DB_IP;
  this.DB_PORT = params.DB_PORT || _conf2.default.db.DB_PORT;
  this.DB_NAME = params.DB_NAME || _conf2.default.db.DB_NAME;
  this.schema = params.schema || _conf2.default.schema;

  this.getDBURL = function () {
    // construct DB_URL
    var DB_URL = "mongodb://" + this.DB_IP + ":" + this.DB_PORT + "/" + this.DB_NAME;
    console.log("DB_URL: " + DB_URL);
    return DB_URL;
  };

  //define schema
  this.defineSchema = function (collection) {
    for (var key in this.schema) {
      if (this.schema.hasOwnProperty(key) && key === collection) {
        return new _mongoose2.default.Schema(this.schema[key]);
      }
    }
  };

  // connect to mongodb
  this.connect = function (collection, cb) {
    var _this = this;
    var db = _mongoose2.default.createConnection(this.getDBURL());
    db.on('error', function (e) {
      return console.error(e);
    });

    db.once('open', function () {
      var tableSchema = _this.defineSchema(collection);
      // deploy schema to model
      var tableModel = db.model(collection, tableSchema);
      if (!db.model(collection)) {
        return console.error("model list deploy failed!");
      }

      if (cb) cb(db, tableModel);
    });
  };

  //insert
  this.insert = function (collection, data, callback) {
    this.connect(collection, function (db, tableModel) {
      var mongoEntity = new tableModel(data);
      mongoEntity.save(function (e) {
        db.close();
        if (e) callback({ status: false, msg: e });else callback({ status: true });
      });
    });
  };

  //find
  this.find = function (collection, findPattern, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(findPattern).exec(function (e, res) {
        db.close();
        if (e) callback({ status: false, msg: e });else callback({ status: true, data: res });
      });
    });
  };

  // findBatch
  this.findBatch = function (collection, findPattern, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find({}).where(findPattern).exec(function (e, res) {
        db.close();
        if (e) callback({ status: false, msg: e });else callback({ status: true, data: res });
      });
    });
  };

  //update
  this.update = function (collection, updateCondition, update, options, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(updateCondition, function (e, res) {
        if (e) {
          callback({ status: false, msg: e });
          return;
        }
        if (res) {
          tableModel.update(updateCondition, update, options, function (e) {
            db.close();
            if (e) callback({ status: false, msg: e });else callback({ status: true });
          });
          return;
        }
        callback({ status: false, msg: "Update error: No this data exist." });
      });
    });
  };

  //remove
  this.remove = function (collection, removeCondition, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(removeCondition, function (e, res) {
        if (e) {
          callback({ status: false, msg: e });
          return;
        }
        if (res) {
          tableModel.remove(removeCondition, function (e) {
            db.close();
            if (e) callback({ status: false, msg: e });else callback({ status: true });
          });
          return;
        }
        callback({ status: false, msg: "Remove error: No this data exist." });
      });
    });
  };
};

module.exports = mongooseClient;