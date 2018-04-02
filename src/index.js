/*
 * Des£ºmongoose-client to make mongodb CRUD more convenient.
 * Author£ºnjhxzhangjh@gmail.com
 * Date£º10/14/2017
 * Ver£º1.0
 * */
import mongoose from 'mongoose';
import conf from '../conf/conf';

let mongooseClient = function (params) {
  this.DB_IP = params.DB_IP || conf.db.DB_IP;
  this.DB_PORT = params.DB_PORT || conf.db.DB_PORT;
  this.DB_NAME = params.DB_NAME || conf.db.DB_NAME;
  this.schema = params.schema || conf.schema;

  this.getDBURL = function () {
    // construct DB_URL
    let DB_URL = "mongodb://" + this.DB_IP + ":" + this.DB_PORT + "/" + this.DB_NAME;
    console.log("DB_URL: " + DB_URL);
    return DB_URL;
  };

  //define schema
  this.defineSchema = function (collection) {
    for (let key in this.schema) {
      if (this.schema.hasOwnProperty(key) && key === collection) {
        return new mongoose.Schema(this.schema[key]);
      }
    }
  };

  // connect to mongodb
  this.connect = function (collection, cb) {
    let _this = this;
    let db = mongoose.createConnection(this.getDBURL());
    db.on('error', function (e) {
      return console.error(e);
    });

    db.once('open', function () {
      let tableSchema = _this.defineSchema(collection);
      // deploy schema to model
      let tableModel = db.model(collection, tableSchema);
      if (!db.model(collection)) {
        return console.error("model list deploy failed!");
      }

      if (cb) cb(db, tableModel);
    });
  };

  //insert
  this.insert = function (collection, data, callback) {
    this.connect(collection, function (db, tableModel) {
      let mongoEntity = new tableModel(data);
      mongoEntity.save(function (e) {
        db.close();
        if (e) callback({status: false, msg: e});
        else callback({status: true});
      });
    });
  };

  //find
  this.find = function (collection, findPattern, callback, sortMode = {}) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(findPattern).sort(sortMode).exec(function (e, res) {
        db.close();
        if (e) callback({status: false, msg: e});
        else callback({status: true, data: res});
      });
    });
  };

  // findBatch
  this.findBatch = function (collection, findPattern, callback, sortMode = {}) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find({}).where(findPattern).sort(sortMode).exec(function (e, res) {
        db.close();
        if (e) callback({status: false, msg: e});
        else callback({status: true, data: res});
      });
    })
  };

  //update
  this.update = function (collection, updateCondition, update, options, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(updateCondition, function (e, res) {
        if (e) {
          callback({status: false, msg: e});
          return;
        }
        if (res) {
          tableModel.update(updateCondition, update, options, function (e) {
            db.close();
            if (e) callback({status: false, msg: e});
            else callback({status: true});
          });
          return;
        }
        callback({status: false, msg: "Update error: No this data exist."});
      });
    });
  };

  //remove
  this.remove = function (collection, removeCondition, callback) {
    this.connect(collection, function (db, tableModel) {
      tableModel.find(removeCondition, function (e, res) {
        if (e) {
          callback({status: false, msg: e});
          return;
        }
        if (res) {
          tableModel.remove(removeCondition, function (e) {
            db.close();
            if (e) callback({status: false, msg: e});
            else callback({status: true});
          });
          return;
        }
        callback({status: false, msg: "Remove error: No this data exist."});
      });
    });
  };

};

module.exports = mongooseClient;
