var express = require('express');
var router = express.Router();
var MongoClient= require('mongodb').MongoClient;
var formidable = require('formidable');
var url = "mongodb://localhost:27017/mobile_taas";

/* Adding a bug API */
router.post('/tester/addabug', function(req, res, next) {
  console.log(req.body);
    var Bug={};
  Bug.bug_id=req.body.bug_id;
  Bug.component=req.body.component;
  Bug.version=req.body.version;
  Bug.summary=req.body.summary;
  Bug.priority=req.body.priority;
  Bug.date_created=Date();
  Bug.date_modified=req.body.date;
  Bug.status=req.body.status;
  
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
   
    dbo.collection("bug").insertOne(bug, function(err, result) {
      if(err)throw err;
      
    res.send("Bug Successfully created");
      }); 
});
});


  /* GET Bug Details */
  //12-07-2019//
router.get('/tester/getbug', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mobile_taas");
      var query = { bug_id:req.query.bug_id };
      dbo.collection("bug").findOne(query,function(err, result) {
        if (err) throw err;
        //console.log(result);
        console.log(result);
        res.send(result);
        return;
      });
    }); 
  });
  
  router.get('/tester/getallbugs', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mobile_taas");
      var info = {
        "data":[]
      };
      dbo.collection("bug").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        info.data = result;
        res.send(info);
  
        return;
      });
    }); 
  });

  

  /* UPDATE/ PUT Bug Details */
  //12-07-2019//
router.post('/tester/editbug', function(req, res) {
    console.log("body",req.body);
    const form = JSON.parse(JSON.stringify(req.body));
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mobile_taas");
        var query = { bug_id:form.bug_id };
        var newvalues = { $set: form };
        dbo.collection("bug").updateOne(query,newvalues,function(err, result) {
          if (err) throw err;
          //console.log(result);
          req.session.user.bug_id=form.bug_id;
          console.log(result);
          //res.send(result);
          //return;
          return res.redirect("/tester");
  
        });
      }); 
  
  });

  
  /* DELETE Bug */
  //12-07-2019//
router.delete('/tester/editbug',function(req,res){
    console.log("delete:",req.body);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mobile_taas");
      var myquery = { bug_id: req.body.bug_id };
    dbo.collection("bug").deleteOne(myquery, function(err, obj) {
      if (err) { 
        console.log(err);
        return res.send("fail");  
      }
      console.log("1 document deleted");
      db.close();
      return res.send("success");
    });
  });
  });


  module.exports = router;
