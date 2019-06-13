const proposal = require('../controllers/proposal');
const express = require('express');
const router = express.Router();

router.get('/query', function (req, res, next) {
  proposal.getByPage(req, res, next);
});

router.post('/add', function (req, res, next) {
  proposal.save(req,res,next);
});

router.get('/delete', function (req, res, next) {
  proposal.delete(req, res, next);
});

// 图表数据
router.get('/charts', (req, res, next) => {
  proposal.getCharts(req, res, next);
});

module.exports = router;