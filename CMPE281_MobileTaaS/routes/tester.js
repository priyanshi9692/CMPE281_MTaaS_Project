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
        return res.redirect("/tester");

      });
    }); 

});

router.get('/download-docs', function(req, res){
  console.log(req.query);
 const file = "/Users/Piyusman/Desktop/Programming_Projects/CMPE281_MTaaS_Project/CMPE281_MobileTaaS/public/upload/" ;
 
 console.log(file);
 
});


router.get('/getLogin', function(req, res){
  res.send(req.session.user.username);

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

router.get('/getprojectsfortest', function(req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mobile_taas");
    var info = {
      "data":[]
    };
    dbo.collection("project_details").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      for(var i=0;i<result.length;i++){
        var values = {}
        values.documentation= result[i].documentation;
        values.link = result[i].link1;
        values.name = result[i].name;
        values.id=result[i]._id;
        values.bugs = result[i].bugs.length;
        if(result[i].tester.includes(req.session.user.username)){
          values.status = true;
        }
        else {
          values.status =false;
        }
        info.data.push(values);
      }
      res.send(info);

      return;
    });
  }); 
});
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

router.get('/bill', function(req, res, next) {
  if (req.session && req.session.user) {
    if(req.session.user.type=="tester"){
      return res.render('bill',{
        user:req.session.user.name       
      });
    }
  }
  return res.redirect("/");
});
router.get('/chat', function(req, res, next) {
  if (req.session && req.session.user) {     
      return res.render('chat',{
        user:req.session.user.name
      });    
  }
  return res.redirect("/");
});
/*jump to Bugs */
router.get('/project_bugs', function(req, res, next) {
if (req.session && req.session.user) {
  if(req.session.user.type=="tester"){

    var project={};
    return res.render('bugs_tabs',{
      user:req.session.user.name,
      project:project
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