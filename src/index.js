/*
 * Des£ºmongoose-client to make mongodb CRUD more convenient.
 * Author£ºnjhxzhangjh@gmail.com
 * Date£º10/14/2017
 * Ver£º1.0
 * */
import mongoose from 'mongoose';
import config from '../conf/conf';

// construct DB_URL
let DB_URL = "mongodb://" + config.db.DB_IP + ":" + config.db.DB_PORT + "/" + config.db.DB_NAME;
console.log("DB_URL: " + DB_URL);

//define schema
function defineSchema(collection){
  let schema = config.schema;
  for(let key in schema){
    if(schema.hasOwnProperty(key) && key === collection){
      return new mongoose.Schema(schema[key]);
    }
  }
}

// connect to mongodb
function connect(collection,cb){
  let db = mongoose.createConnection(DB_URL);
  db.on('error',function(e){
    return console.error(e);
  });

  db.once('open',function(){
    let tableSchema = defineSchema(collection);
    // deploy schema to model
    let tableModel = db.model(collection,tableSchema);
    if(!db.model(collection)){
      return console.error("model list deploy failed!");
    }

    if(cb)cb(db,tableModel);
  });
}

//insert
let insert = function(collection,data,callback){
  connect(collection,function(db,tableModel){
    let mongoEntity = new tableModel(data);
    mongoEntity.save(function(e){
      db.close();
      if(e)callback({status: false, msg: e});
      else callback({status: true});
    });
  });
};

//find
let find = function(collection,findPattern,callback){
  connect(collection,function(db,tableModel){
    tableModel.find(findPattern).exec(function(e,res){
      db.close();
      if(e)callback({status: false, msg: e});
      else callback({status: true, data: res});
    });
  });
};

//update
let update = function(collection,updateCondition,update,options,callback){
  connect(collection,function(db,tableModel){
    tableModel.find(updateCondition,function(e,res){
      if(e){
        callback({status: false,msg: e});
      }
      if(res){
        tableModel.update(updateCondition,update,options,function(e){
          db.close();
          if(e)callback({status: false, msg: e});
          else callback({status: true});
        });
      }
      callback({status: false, msg: "Update error: No this data exist."});
    });
  });
};

//remove
let remove = function(collection,removeCondition,callback){
  connect(collection,function(db,tableModel){
    tableModel.find(removeCondition,function(e,res){
      if(e){
        callback({status: false,msg: e});
      }
      if(res){
        tableModel.remove(removeCondition,function(e){
          db.close();
          if(e)callback({status: false, msg: e});
          else callback({status: true});
        });
      }
      callback({status: false, msg: "Remove error: No this data exist."});
    });
  });
};

exports.mongooseClient = {
  insert,
  update,
  remove,
  find
};