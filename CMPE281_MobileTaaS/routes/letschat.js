var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/*Post Add Project API */
  router.get('/chat', function(req, res, next) {
    if (req.session && req.session.user) {    
      if(req.session.user.type=="tester"){ 
        return res.render('chatTester',{
          user:req.session.user.name
        });    
      }
      else{
        return res.render('chat',{
          user:req.session.user.name
        });  
      }
    }
    return res.redirect("/");
  });

  router.get('/bill', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){      
        return res.render('bill',{
          user:req.session.user.name
        });    
      }
      else {
        return res.render('billmanager',{
          user:req.session.user.name
        });  
      }
    }
    return res.redirect("/");
  });

  module.exports = router;