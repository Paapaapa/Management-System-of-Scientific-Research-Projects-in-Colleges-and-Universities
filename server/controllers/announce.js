const announce = require('../dao/announce');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        announce.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return announce.getByPage(req.query);
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
                        msg: '获取信息失败',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res && res.json({
                    result: -1,
                    msg: '服务器出错，出错原因：' + JSON.stringify(e),
                })
            });
    },
    save(req, res, next) {
        announce.save(req.body)
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
                    result: -1,
                    msg: '服务器出错，出错原因：' + JSON.stringify(e),
                })
            });
    },
    delete(req, res, next) {
        announce.delete(req.query.Id)
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
                    result: -1,
                    msg: '服务器出错，出错原因：' + JSON.stringify(e),
                })
            });
    },
}