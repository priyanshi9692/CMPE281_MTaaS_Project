var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = "mongodb://localhost:27017/mobile_taas";


/* GET Profile Details */
router.get('/getprofile', function(req, res, next) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("mobile_taas");
          var query = { username:req.session.user.username };
          dbo.collection("client").findOne(query,function(err, result) {
            if (err) throw err;
            //console.log(result);
            console.log(result);
            res.send(result);
            return;
          });
        }); 
  });


router.post('/edittesterprofile', function(req, res) {
  console.log("body",req.body);
  const form = JSON.parse(JSON.stringify(req.body));
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mobile_taas");
      var query = { username:req.session.user.username };
      var newvalues = { $set: form };
      dbo.collection("client").updateOne(query,newvalues,function(err, result) {
        if (err) throw err;
        //console.log(result);
        req.session.user.name=form.user_name;
        console.log(result);
        //res.send(result);
        //return;
        return res.redirect("/tester_profile");

      });
    }); 

});


router.get('/download-docs', function(req, res){
  console.log(req.query);
 const file = "/Users/Piyusman/Desktop/Programming_Projects/CMPE281_MTaaS_Project/CMPE281_MobileTaaS/public/upload/" ;
 //
 console.log(file);
 //res.download(file,req.query.doc); // Set disposition and send it.
});


router.get('/getLogin', function(req, res){
  res.send(req.session.user.username);
 //res.download(file,req.query.doc); // Set disposition and send it.
});


router.post('/add-tester', function(req, res) {
  console.log("body",req.body);
  var arr =[];
  arr.push(req.session.user.username);
  //console.log(testerEnrollment);
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
    console.log("We are connected");
    }
    var query = { "documentation": req.body.documentation };
    var update = { $push: { "tester": arr[0] } } ;

    var dbo = db.db("mobile_taas");
    dbo.collection("project_details").updateOne(query,update,function(err, result) {
      if (err) throw err;
      res.send("success");
    });

  });
});


router.post('/add-tester', function(req, res) {
  console.log("body",req.body);
  var arr =[];
  arr.push(req.session.user.username);
  //console.log(testerEnrollment);
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
    console.log("We are connected");
    }
    var query = { "documentation": req.body.documentation };
    var update = { $push: { "tester": arr[0] } } ;

    var dbo = db.db("mobile_taas");
    dbo.collection("project_details").updateOne(query,update,function(err, result) {
      if (err) throw err;
      res.send("success");
    });

  });
});


router.delete('/remove-tester', function(req, res) {
  console.log("body",req.body);
  var arr =[];
  arr.push(req.session.user.username);
  //console.log(testerEnrollment);
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
    console.log("We are connected");
    }
    var query = { "documentation": req.body.documentation };
    var update = { $pull: { "tester": arr[0] } } ;

    var dbo = db.db("mobile_taas");
    dbo.collection("project_details").updateOne(query,update,function(err, result) {
      if (err) throw err;
      res.send("success");
    });

  });
});


module.exports = router;

