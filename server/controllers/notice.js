const notice = require('../dao/notice');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        console.log(req.query)
        notice.getSum(req.query)
            .then(function (sum) {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return notice.getByPage(req.query);
                }
            })
            .then(function (data) {
                if (data) {
                    resData['list'] = data;
                    res.json({
                        code: 1,
                        data: resData,
                        msg: 'success',
                    });
                }
            })
            .catch(function (e) {
                res.json({
                    result: -1,
                    msg: '获取消息失败' + JSON.stringify(e)
                })
            });
    },
    getSelect(req, res, next) {
        const obj = {};
        notice.getSelect()
            .then(function (data) {
                if (data && data.length) {
                    data.forEach((val) => {
                        obj[val.Id] = val.name;
                    });
                }
                res.json({
                    code: 1,
                    data: JSON.stringify(obj),
                    msg: 'success',
                });
            });
    },
    save(req, res, next) {
        notice.save(req.body)
            .then(function (data) {
                console.log(data);
                if (data) {
                    res.json({
                        code: 1,
                        data,
                        msg: 'success',
                    });
                }
            })
            .catch(function (e) {
                console.log(e)
                res.json({
                    code: 0,
                    msg: '操作失败' + e,
                });
            });
    },
    delete(req, res, next) {
        notice.delete(req.query.Id)
            .then(function (data) {
                console.log(data);
                if (data) {
                    res.json({
                        code: 1,
                        data,
                        msg: 'success',
                    });
                }
            })
            .catch(function (e) {
                console.log(e)
                res.json({
                    code: 0,
                    msg: '删除失败' + e,
                });
            });
    },
}