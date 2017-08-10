//Handles all the registration and authentication routes

//post username and password to /api/authenticate to get jwt
//header value for GET /api/auth is x-access-token

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcrypt');

var config = require('../config'); // get our config file
var User   = require('../app/models/user'); // get our mongoose model
var jwtSecret = require('../private/jwtSecret.json');
var dataRoutes = require('./data');
var User = mongoose.model('User');
var Group = mongoose.model('Group');
var app = express.Router();



function setupUser(req,res) {
  var regUser;
  var newGroup;
//TODO: Consider async bcrypt
  // the user is new
  // create a new user
    regUser = new User({
      username: req.body.username,
      password:  bcrypt.hashSync(req.body.password, 10),
      group:  req.body.group,
      groupCode:  req.body.groupCode
    });
  // save the sample user
  regUser.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
  });

  //sets up group document the first time
  newGroup = new Group({
    title: req.body.group,
    keyValue: [{}]
  })
  newGroup.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
  });
  return res.status(200).send({
      success: true,
      message: 'New user created'
  });
}


app.post('/auth/setup', function(req, res) {

//if username used
//if groupcode different

User.find({group : req.body.group}, function(err,user){
  if (err) throw err;
  //if there are some users in that group
  if (Object.keys(user).length !== 0){

        if (user[0].groupCode === req.body.groupCode){
          console.log("The group codes match");
          var match = false;
          for (i=0;i<user.length;i++) {
            if (user[i].username === req.body.username){
              match = true;
              return res.status(200).send({
                  id: 103,
                  success: false,
                  message: 'Username already in use'
              });
              break;
            }
          }
          if (!match) {
            setupUser(req,res);
          }

        }
        else {
          console.log("The group codes are different");
          return res.status(200).send({
              id: 104,
              success: false,
              message: 'Codes are different'
          });
        }
  }
  else {
    setupUser(req,res);
  }
});

});



// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.post('/auth/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username

  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({id: 102 success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (!bcrypt.compareSync(req.body.password,user.password)) {
        res.json({id: 101, success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user , jwtSecret.secret, {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).json({
          id: 100,
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, jwtSecret.secret, function(err, decoded) {
      if (err) {
        return res.json({ id: 105, success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        id: 106,
        success: false,
        message: 'No token provided.'
    });

  }
});

//////////////PROTECTED ROUTES//////////////

app.get('/', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  res.json({ id: 108, message: 'Valid token'});
});

app.use('/data', dataRoutes);

module.exports = app;
