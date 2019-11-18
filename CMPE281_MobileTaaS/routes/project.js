var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');

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
  
  router.get('/projects', function(req, res, next) {
    if (req.session && req.session.user) {
      if(req.session.user.type=="tester"){
        return res.render('tester_profile',{
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
              res.send("Successfully inserted new Project");
                }); 
            });  
    });
        res.redirect("http://localhost:3000/dashboard");
  });


  module.exports = router;
  
  