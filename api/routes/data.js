var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var User   = require('../app/models/user'); // get our mongoose model
var Group = mongoose.model('Group');

var User = mongoose.model('User');
var app = express.Router();

// Sets a specific value using explicit target values
app.post('/', function(req, res) {
  found = false;
  Group.findOne({title : req.decoded._doc.group}, function(err,group){
    for (i=0; i<group.keyValue.length;i++){
      if (group.keyValue[i].target == req.body.tar){
        found = true;
         group.keyValue[i].value = req.body.val;
         group.save();
         res.status(200).send({
           id: 109,
           updated : true
         });
         break;
      }
    }
    if (!found){
      group.keyValue.push({target: req.body.tar, value: req.body.val})
      group.save();
      res.status(200).send({
        id: 110,
        created: true
      });
    }
  });
});

// Just increments the value using username from JWT - target should just be target, not target%%username
app.post('/increment', function(req, res) {
  found = false;
  Group.findOne({title : req.decoded._doc.group}, function(err,group){
    for (i=0; i<group.keyValue.length;i++){
      console.log(req.decoded._doc.username);
      console.log("total target: " + req.body.tar + '%%' + req.decoded._doc.username);
      if (group.keyValue[i].target == req.body.tar + '%%' + req.decoded._doc.username){
        found = true;
         group.keyValue[i].value = group.keyValue[i].value+1;
         group.save();
         res.status(200).send({
           id: 115,
           updated : true
         });
         break;
      }
    }
    if (!found){
      group.keyValue.push({target: req.body.tar + '%%' + req.decoded._doc.username, value: 1})
      group.save();
      res.status(200).send({
        id: 116,
        created: true
      });
    }
  });
});


app.get('/', function(req, res) {
  found = false;
  Group.findOne({title : req.decoded._doc.group}, function(err,group){
    for (i=0; i<group.keyValue.length;i++){
      if (group.keyValue[i].target == req.query.tar){
         found = true;
         res.status(200).send({
           id: 111,
           cVal: group.keyValue[i].value
         });
         break;
      }
    }
    if (!found){
      res.status(200).send({
        id: 113,
        found: false
      });
    }
  });
});

app.get('/init', function(req, res) {
  Group.findOne({title : req.decoded._doc.group}, function(err,group){
    allData ={};
    for (i=0; i<group.keyValue.length;i++) {
      allData[group.keyValue[i].target] = group.keyValue[i].value;
    }
    res.status(200).send({
      id: 114,
      data: allData
    });
  });
});

module.exports = app;
