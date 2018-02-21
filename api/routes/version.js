var express     = require('express');
var app = express.Router();


app.get('/version', function(req, res) {
    res.status(200).send({
      version: 0.001
    });
  });

module.exports = app;
