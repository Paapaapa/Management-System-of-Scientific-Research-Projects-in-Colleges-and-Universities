const comment = require('../controllers/comment');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  comment.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  comment.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  comment.delete(req, res, next);
});

module.exports = router;