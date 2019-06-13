const ProjectCategory = require('../dao/projectCategory');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        ProjectCategory.getSum(req.query)
            .then(function (sum) {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return ProjectCategory.getByPage(req.query);
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
                console.log(e)
                res.json({
                    result: -1,
                    msg: '获取项目类别信息失败',
                })
            });
    },
    getSelect(req, res, next) {
        const obj = {};
        ProjectCategory.getAll()
            .then(function (data) {
                if (data && data.length) {
                    data.forEach(function (val) {
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
        ProjectCategory.save(req.body)
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
                    msg: '项目类别操作失败',
                });
            });
    },
    delete(req, res, next) {
        ProjectCategory.delete(req.query.Id)
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
                    msg: '项目类别删除失败' + e,
                });
            });
    },
}