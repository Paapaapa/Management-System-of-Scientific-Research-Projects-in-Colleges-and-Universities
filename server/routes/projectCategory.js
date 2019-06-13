const ProjectCategory = require('../controllers/projectCategory');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  ProjectCategory.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  console.log(req.body)
  ProjectCategory.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  ProjectCategory.delete(req, res, next);
});

router.get('/select', function (req, res, next) {
  ProjectCategory.getSelect(req, res, next);
});

module.exports = router;