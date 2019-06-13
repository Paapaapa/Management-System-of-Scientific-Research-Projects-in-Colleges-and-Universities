const files = require('../dao/files');
const moment = require('moment');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        files.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return files.getByPage(req.query);
                }
            })
            .then((data) => {
                if (data) {
                    resData['list'] = data;
                    res && res.json({
                        code: 1,
                        data: resData,
                        msg: 'success',
                    });
                } else {
                    res && res.json({
                        code: 0,
                        msg: '获取失败',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res.json({
                    result: -1,
                    msg: '服务器出错，错误原因：' + JSON.stringify(e),
                })
            });
    },
    save(req, res, next) {
        files.save(req)
            .then((data) => {
                if (data) {
                    res && res.json({
                        code: 1,
                        data,
                        msg: 'success',
                    });
                } else {
                    res && res.json({
                        code: 0,
                        msg: '操作失败',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res && res.json({
                    code: -1,
                    msg: '服务器出错，错误原因：' + JSON.stringify(e),
                });
            });
    },
    delete(req, res, next) {
        files.delete(req.query.Id)
            .then((data) => {
                if (data) {
                    res && res.json({
                        code: 1,
                        data,
                        msg: 'success',
                    });
                } else {
                    res && res.json({
                        code: 0,
                        msg: '操作失败',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res && res.json({
                    code: -1,
                    msg: '服务器出错，错误原因：' + JSON.stringify(e),
                });
            });
    },
}