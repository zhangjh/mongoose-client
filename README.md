 # mongoose-client
 A mongoose client to make mongo CRUD convenient.
 
 # Install 
 `npm install mongoose-client`
 
 # Usage 
 ## 1. require mongoose-client
 ```
 var mongooseClient = require("mongoose-client");
 ```
 ## 2. Modify config
 You must modify the configuration to your owns.
 So you can do it like this:
 ```js
    var mongooseClientInstance = new mongooseClient({
      DB_IP: "xxx",
      DB_PORT: "xxx",
      DB_NAME: "xxx",
      schema: {
        collection1: {
          key1: {type: String},
          key2: {type: String}
        },
        collection2: {
          key1: {type: String},
          key2: {type: JSON},
          key3: {type: Array}
        },
        ... 
      }
    });
 ```
 
 ## 3. Use it
 ```js
 // insert:
 mongooseClientInstance.insert(collection,data,callback);
 
 // remove:
 mongooseClientInstance.remove(collection,removeCondition,callback);
 
 // update:
 mongooseClientInstance.update(collection,updateCondition,update,options,callback);
 
 // find:
 mongooseClientInstance.find(collection,findPattern,callback);
 ```
