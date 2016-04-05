var express = require('express');
var router = express.Router();
var models = require('../models/index.js');
var BaseReminder = models.BaseReminder;

router.get('/', function(req, res, next) {

  BaseReminder.findAll()
      .then(function(baseReminders) {
        res.status(200);
        res.send(baseReminders);
      });

});

router.get('/:id', function(req, res, next) {

  BaseReminder.findAll({
    where: {id: req.params.id}
  }).then(function(baseReminder) {
    res.status(200);
    res.send(baseReminder);
  }).catch(function(error) {
    res.status(500);
    res.send(error)
  });

});

router.post('/', function(req, res, next) {

  BaseReminder.create({
    name: req.body.name,
    message: req.body.message,
    detail: req.body.detail,
    lateMessage: req.body.lateMessage,
    lateDetail: req.body.lateDetail,
    CategoryId: req.body.category
  }).then(function () {
    BaseReminder.findAll().then(function (baseReminders) {
      res.status(200);
      res.send(baseReminders);
    });
  }).catch(function(error) {
    if (error.name === "SequelizeValidationError") {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(error);
  });

});

router.put('/:id', function(req, res, next) {

  console.log(req);
  BaseReminder.update({
    name: req.body.name,
    message: req.body.message,
    detail: req.body.detail,
    lateMessage: req.body.lateMessage,
    lateDetail: req.body.lateDetail,
    CategoryId: req.body.category
  }, {
    where: {id: req.params.id},
    fields: Object.keys(req.body)
  }).then(function() {
    BaseReminder.findAll().then(function(baseReminders) {
      res.status(200).send(baseReminders);
    });
  }).catch(function(error) {
    if (error.name === "SequelizeValidationError") {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(error);
  });

});

router.delete('/:id', function(req, res, next) {

  BaseReminder.destroy({
    where: {id: req.params.id}
  }).then(function() {
    BaseReminder.findAll().then(function(baseReminders) {
      res.status(200).send(baseReminders);
    })
  }).catch(function(error) {
    res.status(500).send(error);
  });

});


module.exports = router;
