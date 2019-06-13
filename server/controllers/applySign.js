const applySign = require('../dao/applySign');

module.exports = {
    getByProject(req, res, next) {
        applySign.getByProjectId(req.query.project_id)
            .then((data) => {
                if (data) {
                    res && res.json({
                        code: 1,
                        data,
                        msg: '操作成功',
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
                    msg: '服务器出错，出错原因：' + JSON.stringify(e)
                })
            });
    },
    getByMan(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        applySign.countBySign(req.query.signman_id)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return applySign.getBySign(req.query);
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
                }
            })
            .catch((e) => {
                console.log(e)
                res && res.json({
                    code: -1,
                    msg: '服务器出错，出错原因：' + JSON.stringify(e)
                })
            });
    },
    save(req, res, next) {
        applySign.save(req, res, next)
            .then((data) => {
                if (data) {
                    res && res.json({
                        code: 1,
                        data,
                        msg: '操作成功',
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
                    msg: '服务器出错，出错原因：' + e,
                });
            });
    },
    delete(req, res, next) {
        applySign.delete(req.query.Id)
            .then((data) => {
                if (data) {
                    res.json({
                        code: 1,
                        data,
                        msg: '操作成功',
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
                res.json({
                    code: -1,
                    msg: '服务器出错，出错原因：' + e,
                });
            });
    },
}