var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = "mongodb://localhost:27017/mobile_taas";


/* GET Profile Details */
router.get('/tester_update', function(req, res, next) {
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
        req.session.user.username=form.user_name;
        console.log(result);
        //res.send(result);
        //return;
        return res.redirect("/profile");

      });
    }); 

});

//GET all projects from tester-enrollments
router.get('/getprojects_tester', function(req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mobile_taas");
    var info = {
      "data":[]
    };
    dbo.collection("tester_enrollments").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      info.data = result;
      res.send(info);

      return;
    });
  }); 
});

//UPDATE project to JOIN the project
router.post('/join_project', function(req, res) {
  console.log("body",req.body);
  var projectname = req.body.name;
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
    console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
    var myquery = { name: projectname};
    var newvalues = { $set: {"is_joined" :true} };
    dbo.collection("tester_enrollments").updateOne(myquery,newvalues, function(err, res) {
        if(err)throw err;
        //console.log(result);
      //res.send("Successfully inserted new Project");
        }); 
    });  
  res.redirect("http://localhost:3000/projects");
});


  //**************** for Tester********************
  /*jump to Emulators*/
  router.get('/addemulator', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){
        return res.render('emulators',{
          user:req.session.user.name
        });
      } else if(req.session.user.type=="projectmanager") {
        return res.render('addprojects',{
          user:req.session.user.name
        });
      }
    }
    return res.redirect("/");
  });
 /*jump to Bugs */
 router.get('/project_bugs', function(req, res, next) {
  if (req.session && req.session.user) {
    if(req.session.user.type=="tester"){
      return res.render('bugs',{
        user:req.session.user.name
      });
    } else if(req.session.user.type=="projectmanager") {
      return res.render('bugs',{
        user:req.session.user.name
      });
    }
  }
  return res.redirect("/");
});

module.exports = router;

