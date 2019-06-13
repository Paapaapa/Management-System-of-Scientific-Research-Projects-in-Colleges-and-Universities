const fruit = require('../controllers/fruit');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  fruit.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  fruit.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  fruit.delete(req, res, next);
});

// 图表数据
router.get('/charts', (req, res, next) => {
  fruit.getCharts(req, res, next);
});

module.exports = router;