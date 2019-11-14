var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


/* SHOW LOGIN PAGE */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* SHOW REGISTRATION PAGE */
router.get('/register', function(req, res, next) {
  res.render('register');
});


/* SHOW REGISTRATION PAGE */
router.get('/dashboard', function(req, res, next) {
  if (req.session && req.session.user) {
    if(req.session.user.type=="tester"){
      return res.render('tester_home',{
        user:req.session.user.name
      });
    } else if(req.session.user.type=="projectmanager") {
      return res.render('manager_home',{
        user:req.session.user.name
      });
    }
  }
  return res.redirect("/");
  
});


/* Registration API */
router.post('/register', function(req, res, next) {
  console.log(req.body);
  var client={};
  client.usertype=req.body.usertype;
  client.name=req.body.name;
  client.email=req.body.email;
  client.username=req.body.username;
  client.password=req.body.pass;
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
   
    dbo.collection("client").insertOne(client, function(err, result) {
      if(err)throw err;

      
    res.send("Successfully inserted");
      }); 
});
});


/* LOGIN CHECK API */
router.get('/login', function(req, res, next) {
  var client={};

  var username=req.query.username;
  var password=req.query.password;
  console.log(password);
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
    dbo.collection("client").find({}).toArray(function(err, result) {
      if (err) throw err;
      for(var i=0;i<result.length;i++){
       
        if(username==result[i].username && password==result[i].password){
          client.name = result[i].name;
          client.username=result[i].username;
          client.type=result[i].usertype;
          console.log(client);
          req.session.user = client;
          return res.send("success");
        }
       
      }
      return res.send("username or password is incorrect, please try again!");
   
      }); 
});
});
module.exports = router;
