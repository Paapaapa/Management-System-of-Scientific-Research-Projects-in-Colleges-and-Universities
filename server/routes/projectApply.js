const ProjectApply = require('../controllers/projectApply');
const applyZCheck = require('../controllers/applyZCheck');
const applySign = require('../controllers/applySign');
const stop = require('../controllers/stop');
const express = require('express');
const router = express.Router();

router.get('/query', (req, res, next) => {
  ProjectApply.getByPage(req, res, next);
});

router.post('/add', (req, res, next) => {
  ProjectApply.save(req, res, next);
});

router.get('/delete', (req, res, next) => {
  ProjectApply.delete(req, res, next);
});

router.get('/select', (req, res, next) => {
  ProjectApply.getSelect(req, res, next);
});

// 图表数据
router.get('/charts', (req, res, next) => {
  ProjectApply.getCharts(req, res, next);
});

// 专家评审
router.get('/zcheck', (req, res, next) => {
  applyZCheck.getByProject(req, res, next);
});

router.post('/zcheck/add', (req, res, next) => {
  applyZCheck.save(req, res, next);
});

router.get('/zcheck/delete', (req, res, next) => {
  applyZCheck.delete(req, res, next);
});

// 选题管理
router.get('/sign', (req, res, next) => {
  applySign.getByMan(req, res, next);
});

router.post('/sign/add', (req, res, next) => {
  applySign.save(req, res, next);
});

router.get('/sign/delete', (req, res, next) => {
  applySign.delete(req, res, next);
});

// 中止
router.get('/stop', (req, res, next) => {
  stop.getByPage(req, res, next);
});

router.post('/stop/add', (req, res, next) => {
  stop.save(req, res, next);
});

router.get('/stop/delete', (req, res, next) => {
  stop.delete(req, res, next);
});

module.exports = router;