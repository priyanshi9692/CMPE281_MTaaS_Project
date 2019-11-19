// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
  if(!err) {
    useUnifiedTopology: true
    console.log("We are connected");
  }

  
});