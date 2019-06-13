let express = require('express');
let fs = require("fs");
let path = require("path");
let router = express.Router();
let utils = require('../utils/utils');
let moment = require('moment');
const contentType = {
    'bmp': 'application/x-bmp',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jpe': 'image/jpeg',
    'gif': 'image/gif'
}

// router.post('/upload/:document', function (req, res, next) {
//     let path=req.params.ducument;
//     let files = req.files;
//     if (files.length === 0) {
//         console.log('抱歉，未找到文件')
//         return;
//     } else {
//         let fileInfos = [];
//         let response = {};
//         for (var i in files) {
//             let file = files[i];
//             let fileInfo = {};
//             fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname); //这里修改文件名。
//             // 获取文件基本信息
//             fileInfo.mimetype = file.mimetype;
//             fileInfo.originalname = file.originalname;
//             fileInfo.size = file.size;
//             fileInfo.path = file.path;

//             fileInfos.push(fileInfo);
//         }

//         res.json({
//             msg: response,
//             code: 1
//         })
//     }
// });

router.get('/download/:path', function (req, res, next) {

    // 　//第一种方式
    //   var f="./upload/toolModel.xlsx";
    // //   var f = req.params[0];
    //   f = path.resolve(f);
    //   console.log('Download file: %s', f);
    //   res.download(f);
    //第二种方式
    // var path = "./upload/toolModel.xlsx";
    let path = req.params.path.split('&');
    let f = fs.createReadStream(`./upload/${path[0]}/${path[1]}`);
    let suffix = path[1].split('.')[1];
    if (Object.keys(contentType).indexOf(suffix) === -1)
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': `attachment;filename=download_file_${moment().format('YYYYMMDDHHmmss')}.${suffix}`
        });
    // 下载图片
    else {
        res.writeHead(200, {
            'Content-Type': contentType[suffix],
        });
    }
    f.pipe(res);
});

router.get('/delete', function (req, res, next) {
    let result = utils.removeFile(req.query.file_path);
    res.json({
        code: result ? 1 : 0,
        msg: result ? 'success' : 'fail',
    });
});

module.exports = router;