var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = "mongodb://localhost:27017/mobile_taas";


/*GET UI page */
router.get('/profile', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){
        return res.render('tester_profile',{
          user:req.session.user.name
        });
      } else if(req.session.user.type=="projectmanager") {
        return res.render('manager_profile',{
          user:req.session.user.name
        });
      }
    }
    return res.redirect("/");
    
  });
  
  /*GET UI page */
  router.get('/projects', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){
        return res.render('projects_tester',{
          user:req.session.user.name
        });
      } else if(req.session.user.type=="projectmanager") {
        return res.render('projects',{
          user:req.session.user.name
        });
      }
    }
    return res.redirect("/");
  });


  /*GET UI page */
  router.get('/add', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){
        return res.render('tester_profile',{
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

/*Post Add Project API */
  router.post('/addproject', function(req,res){
        var form = new formidable.IncomingForm();
        form.parse(req);
        var project ={};
        var pro =[];
        form.on('field', (name, field) => {
            pro.push(field);
            console.log('Field', name, field)
          });
      form.on('fileBegin', function (name, file){
            var ext = file.name.split(".")[1];
            file.name = pro[0] + "_" + req.session.user.username + "_"+ name + "." + ext;
            pro.push(file.name);
            console.log(file.name);
            file.path = process.cwd() + '/public/uploads/' + file.name;
        });
    
        form.on('file', function (name, file){
            //pro.push(file.name);
            console.log('Uploaded ' + file.name);
        });
        form.on('end', () => {
            project.name = pro[0];
            project.description=pro[1];
            project.link1=pro[2];
            project.link2=pro[3];
            project.documentation = pro[4];
            project.testdata = pro[5];
            project.testcases = pro[6];
            console.log(project);
            console.log(pro);
            MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
            if(!err) {
            console.log("We are connected");
            }
            var dbo = db.db("mobile_taas");
            dbo.collection("project_details").insertOne(project, function(err, result) {
                if(err)throw err;
              //res.send("Successfully inserted new Project");
                }); 
            });  
    });
        res.redirect("/dashboard");
  });

    /*GET All Project Names */
    router.get('/getprojects', function(req, res, next) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mobile_taas");
        var projects=[];
        dbo.collection("project_details").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          for(var i=0;i<result.length;i++){
            projects.push(result[i].name);
          }
          console.log(projects);
          res.send(projects);
          return;
        });
      }); 
    });


/* GET Project Details */
router.get('/getproject', function(req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mobile_taas");
    var query = { name:req.query.name };
    dbo.collection("project_details").findOne(query,function(err, result) {
      if (err) throw err;
      //console.log(result);
      console.log(result);
      res.send(result);
      return;
    });
  }); 
});

router.get('/getAllprojects', function(req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mobile_taas");
    var info = {
      "data":[]
    };
    dbo.collection("project_details").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      info.data = result;
      res.send(info);

      return;
    });
  }); 
});

router.post('/join_project', function(req, res) {
  console.log("body",req.body);
  var testerEnrollment = {};
  testerEnrollment.name = req.body.name;
  testerEnrollment.documentation = req.body.documentation;
  testerEnrollment.is_joined = true;
  console.log(testerEnrollment);
  MongoClient.connect("mongodb://localhost:27017/mobile_taas", function(err, db) {
    if(!err) {
    console.log("We are connected");
    }
    var dbo = db.db("mobile_taas");
    dbo.collection("tester_enrollments").insertOne(testerEnrollment, function(err, res) {
        if(err)throw err;
      //res.send("Successfully inserted new Project");
        }); 
    });  
  // const form = JSON.parse(JSON.stringify(req.body));
  //   MongoClient.connect(url, function (err, db) {
  //     if (err) throw err;
  //     var dbo = db.db("mobile_taas");
  //     var query = { username:req.session.user.username };
  //     var newvalues = { $set: testerEnrollment};
      

  //     dbo.collection("tester_enrollments").updateOne(query,newvalues,function(err, result) {
  //       if (err) throw err;
  //       console.log(result);
  //       req.session.user.name=form.user_name;
  //       console.log(result);
  //       //res.send(result);
  //       //return;
  //       return res.redirect("/tester_profile");

  //     });
  //   }); 
  res.redirect("http://localhost:3000/projects");
});

/* UPDATE/ PUT Project Details */
router.post('/editproject', function(req, res) {
  console.log("body",req.body);
  const form = JSON.parse(JSON.stringify(req.body));
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mobile_taas");
      var query = { name:form.name };
      var newvalues = { $set: form };
      dbo.collection("project_details").updateOne(query,newvalues,function(err, result) {
        if (err) throw err;
        //console.log(result);
        req.session.user.name=form.name;
        console.log(result);
        //res.send(result);
        //return;
        return res.redirect("/project");

      });
    }); 

});
/* DELETE Project */
router.delete('/editproject',function(req,res){
  console.log("delete:",req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mobile_taas");
    var myquery = { name: req.body.name };
  dbo.collection("project_details").deleteOne(myquery, function(err, obj) {
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

  