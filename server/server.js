const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({
  dest: './upload'
});
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');

let server = express();
server.listen(3003);

//1.获取请求数据
//get自带
server.use(bodyParser.json());
server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function () {
  var keys = [];
  for (var i = 0; i < 100000; i++) {
    keys[i] = 'a_' + Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20 * 60 * 1000 //20min
  }));
})();

//4.route
server.use('/api/person', require('./routes/person'));
server.use('/api/projectApply', require('./routes/projectApply'));
server.use('/api/projectCategory', require('./routes/projectCategory'));
server.use('/api/expenditure', require('./routes/expenditure'));
server.use('/api/fruit', require('./routes/fruit'));
server.use('/api/notice', require('./routes/notice'));
server.use('/api/file', require('./routes/file'));
server.use('/api/proposal', require('./routes/proposal'));
server.use('/api/midcheck', require('./routes/midcheck'));
server.use('/api/conclude', require('./routes/conclude'));
server.use('/api/comment', require('./routes/comment'));
server.use('/api/announce', require('./routes/announce'));
server.use('/api/files', require('./routes/files'));