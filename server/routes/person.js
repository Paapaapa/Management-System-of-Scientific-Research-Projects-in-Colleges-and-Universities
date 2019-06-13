const Person = require('../controllers/person');
const express = require('express');
const router = express.Router();

router.post('/login', function (req, res, next) {
  Person.loginCheck(req, res, next);
});

router.get('/query', function (req, res, next) {
  Person.getByPage(req, res, next);
});

router.get('/select', function (req, res, next) {
  Person.getSelect(req, res, next);
});

router.get('/avatar', function (req, res, next) {
  Person.getAvatar(req, res, next);
});

router.get('/currentUser', function (req, res, next) {
  Person.getCurrentUser(req, res, next);
});

router.post('/add', function (req, res, next) {
  Person.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  Person.delete(req, res, next);
});

module.exports = router;