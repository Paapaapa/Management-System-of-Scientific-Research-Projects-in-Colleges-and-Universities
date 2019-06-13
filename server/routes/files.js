const files = require('../controllers/files');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  files.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  files.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  files.delete(req, res, next);
});

module.exports = router;