var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
    dbo.collection("project_manager").find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      var data =[];
      for(var i=0;i<result.length;i++){
        var manager={};
        manager.firstname=result[i].firstname;
        manager.lastname = result[i].lastname;
        manager.email = result[i].email;
        data.push(manager);
        console.log(manager);
      }
    res.render('index', { title: 'Mobile-TaaS' });
      }); 
});
  

  });
module.exports = router;
