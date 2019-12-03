var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/*Post Add Project API */
  router.get('/chat', function(req, res, next) {
    if (req.session && req.session.user) {     
        return res.render('chat',{
          user:req.session.user.name
        });    
    }
    return res.redirect("/");
  });
  module.exports = router;