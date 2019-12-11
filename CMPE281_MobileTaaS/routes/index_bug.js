var express = require('express');
var router = express.Router();
var MongoClient= require('mongodb').MongoClient;

/* Adding a bug API */
router.post('/tester/addabug', function(req, res, next) {
  console.log(req.body);
  var Bug={};
  Bug.Bug_ID=req.body.Bug_ID;
  Bug.product=req.body.product;
  Bug.component=req.body.component;
  Bug.version=req.body.version;
  Bug.summary=req.body.summary;
  Bug.alias=req.body.alias;
  Bug.priority=req.body.priority;
  Bug.rep_platform=req.body.rep_platform;
  Bug.op_sys=req.body.op_sys;
  Bug.date_created=Date();
  Bug.date_modified=req.body.date;
  Bug.status=req.body.status;
  
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
   
    dbo.collection("Bug").insertOne(Bug, function(err, result) {
      if(err)throw err;
      
    res.send("Bug Successfully created");
      }); 
});
});

/* Search for a bug API */
router.get('/tester/searchabug', function(req, res, next) {
    var Bug={};
    var ID=req.query.Bug_ID;
    var product=req.query.product;
    console.log(Bug_ID);
    MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
      if(!err) {
        console.log("We are connected");
      }
      var dbo = db.db("mobile_taas");
      dbo.collection("Bug").find({}).toArray(function(err, result) {
        if (err) throw err;
        for(var i=0;i<result.length;i++){
         
          if(Bug_ID==result[i].ID && product==result[i].product){
            Bug.Bug_ID = result[i].ID;
            Bug.product=result[i].product;
            console.log(Bug);
            return res.send("We found your Bug !");
          }
         
        }
        return res.send("Could Not Find the Bug you are looking for, please try again!");
     
        }); 
  });
  });

  /* Update a bug API */
router.put('/tester/updateabug', function(req, res, next) {
    var Bug={};
    var ID=req.query.Bug_ID;
    var product=req.query.product;
    var component=req.query.component;
    var updated_version=2;
    var updated_priority="High";
    var updated_summary="This is an updated version of the earlier Bug";
    var status="Open";
    var date_modified=Date();
    console.log(Bug_ID);
    MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
      if(!err) {
        console.log("We are connected");
      }
      var dbo = db.db("mobile_taas");
      criteria={ID=Bug.Bug_ID,product=Bug.product,component=Bug.component};
      update={Bug.version=updated_version;Bug.priority=updated_priority,Bug.summary=updated_summary,Bug.status=status,Bug.date_modified=date_modified};

      
      dbo.collection("Bug").find({}).toArray(function(err, result) {
        if (err) throw err
        for(var i=0;i<result.length;i++){

            dbo.collection("Bug").find(criteria,update)
            console.log(Bug);
            return res.send("Bug Successfully updated");
         
        }
        return res.send("Could Not Find the Bug you are looking for, please try again!");
     
        }); 
  });
  });

  /* Delete a bug API */
router.put('/tester/deleteabug', function(req, res, next) {
    var Bug={};
    var ID=req.query.Bug_ID;
    var product=req.query.product;
    var component=req.query.component;
    console.log(Bug_ID);
    MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
      if(!err) {
        console.log("We are connected");
      }
      var dbo = db.db("mobile_taas");
      criteria={ID=Bug.Bug_ID,product=Bug.product,component=Bug.component};
           
      dbo.collection("Bug").find({}).toArray(function(err, result) {
        if (err) throw err
        for(var i=0;i<result.length;i++){

            dbo.collection("Bug").remove(criteria,1)
            console.log(Bug);
            return res.send("Bug Successfully deleted");         
        }
        return res.send("Could Not Find the Bug you are looking for, please try again!");
     
        }); 
  });
  });
  module.exports = router;
