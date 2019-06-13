const notice = require('../controllers/notice');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  notice.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  console.log(req.body)
  notice.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  notice.delete(req, res, next);
});

module.exports = router;