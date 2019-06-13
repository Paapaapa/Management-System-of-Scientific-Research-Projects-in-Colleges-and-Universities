const conclude = require('../controllers/conclude');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  conclude.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  conclude.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  conclude.delete(req, res, next);
});

// 图表数据
router.get('/charts', (req, res, next) => {
  conclude.getCharts(req, res, next);
});

module.exports = router;