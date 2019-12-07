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

  if (req.session && req.session.user) {
    if(req.session.user.type=="tester"){
      client.usertype=req.body.usertype;
      client.user_name=req.body.user_name;
      client.email=req.body.email;
      client.first_name=req.body.first_name;
      client.last_name=req.body.last_name;
      client.address=req.body.address;
      client.city=req.body.city;
      client.country=req.body.country;
      client.zipcode=req.body.zipcode;
      client.skill=req.body.skill;
    } else if(req.session.user.type=="projectmanager") {
      client.usertype=req.body.usertype;
      client.name=req.body.name;
      client.email=req.body.email;
      client.username=req.body.username;
      client.password=req.body.pass;
      client.address=req.body.address;
      client.city=req.body.city;
      client.state=req.body.state;
      client.zipcode=req.body.zipcode;
    }
  }
 
  

  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
   
    dbo.collection("client").insertOne(client, function(err, result) {
      if(err)throw err;

      
    return res.redirect("/dashboard");
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
