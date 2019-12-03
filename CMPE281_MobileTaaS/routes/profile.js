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





  router.post('/editprofile', function(req, res) {
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
            req.session.user.name=form.name;
            console.log(result);
            //res.send(result);
            //return;
            return res.redirect("/profile");
    
          });
        }); 
   
  });


module.exports = router;

