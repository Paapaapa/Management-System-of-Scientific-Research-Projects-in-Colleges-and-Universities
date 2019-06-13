const midcheck = require('../controllers/midcheck');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  midcheck.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  midcheck.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  midcheck.delete(req, res, next);
});

// 图表数据
router.get('/charts', (req, res, next) => {
  midcheck.getCharts(req, res, next);
});

module.exports = router;