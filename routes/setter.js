var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var config = require('../config'); // get our config file
var User   = require('../app/models/user'); // get our mongoose model

var User = mongoose.model('User');
var app = express.Router();


app.get('/', function(req, res) {
  //TODO: Need to create collection when new group created
  //when user requests +1 to topic, check in above collection, add 1 or add topic
  //
  
  res.send('Group: ' + req.decoded._doc.group);
});

module.exports = app;
