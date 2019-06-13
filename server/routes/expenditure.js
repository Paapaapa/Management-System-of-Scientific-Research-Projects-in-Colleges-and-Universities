const Expenditure = require('../controllers/expenditure');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  Expenditure.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  console.log(req.body)
  Expenditure.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  Expenditure.delete(req, res, next);
});

router.get('/charts', function (req, res, next) {
  Expenditure.getCharts(req, res, next);
});

module.exports = router;