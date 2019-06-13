const announce = require('../controllers/announce');
const express = require('express');
const router = express.Router();

router.get('/query', (req, res, next) => {
  announce.getByPage(req, res, next);
});

router.post('/add', (req, res, next) => {
  announce.save(req, res, next);
});

router.get('/delete', (req, res, next) => {
  announce.delete(req, res, next);
});

module.exports = router;