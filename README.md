# mongoose-client
 A mongoose client to make mongo CRUD convenient.
 
 # Install 
 npm install mongoose-client
 
 # Usage 
 ## 1. Make config
 First, you must modify the configuration to your owns.
 Open conf/config to modify the default configuration.
 
 ## 2. require mongoose-client
 ```
 var mongooseClient = require("mongoose-client");
 ```
 
 ##3. Use it
 ```
 insert:
 mongooseClient.insert(collection,data,callback);
 
 remove:
 mongooseClient.remove(collection,removeCondition,callback);
 
 update:
 mongooseClient.update(collection,updateCondition,update,options,callback);
 
 find:
 mongooseClient.find(collection,findPattern,callback);
 ```
