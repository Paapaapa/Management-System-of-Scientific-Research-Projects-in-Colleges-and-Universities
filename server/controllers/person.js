const Person = require('../dao/person');

module.exports = {
    // 登录校验
    loginCheck(req, res, next) {
        Person.checkPerson({
                pid: req.body.pid,
                pwd: req.body.pwd
            })
            .then(function (data) {
                if (data && data.length > 0 && data[0].is_passed === 1 && data[0].del_flag === 0) {
                    res.json({
                        code: 1,
                        data: [{
                            Id: data[0].Id,
                            name: data[0].name,
                            role: data[0].role,
                        }],
                        currentAuthority: data[0].role,
                        status: true,
                        msg: '登录成功'
                    });
                } else {
                    res.json({
                        code: 0,
                        data,
                        currentAuthority: 'guest',
                        status: false,
                        msg: data.length < 1 || data[0].del_flag === 1 ? "抱歉，此用户不存在" : "抱歉，此用户尚未审核"
                    });
                }
            })
            .catch(function (e) {
                res.json({
                    result: -1,
                    msg: '获取登录信息失败' + JSON.stringify(e)
                })
                console.log(e)
            });
    },
    // 获取展示人员数据
    getSelect(req, res, next) {
        const obj = {};
        const role = (req && req.query.role) || undefined;
        Person.getSelect(role)
            .then((data) => {
                if (data && data.length) {
                    data.forEach((val) => {
                        obj[val.Id] = val.name;
                    });
                }
                res && res.json({
                    code: 1,
                    data: JSON.stringify(obj),
                    msg: 'success',
                });
            });
        return obj;
    },
    getAvatar(req, res, next) {
        const obj = {};
        Person.getAvatar()
            .then((data) => {
                if (data && data.length) {
                    data.forEach((val) => {
                        obj[val.Id] = val.avatar;
                    });
                }
                res && res.json({
                    code: 1,
                    data: JSON.stringify(obj),
                    msg: 'success',
                });
            })
            .catch(err => {
                console.log(err);
                res && res.json({
                    code: -1,
                    msg: '服务器出错，错误原因：' + err,
                });
            })
    },
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        Person.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return Person.getByPage(req.query);
                }
            })
            .then((data) => {
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
                    msg: '获取人员信息失败' + JSON.stringify(e)
                })
            });
    },
    // 获取当前用户
    getCurrentUser(req, res, next) {
        Person.getById({
            pid: req.query.Id,
        }).then(function (data) {
            if (data && data.length) {
                res.json({
                    code: 1,
                    currentUser: data[0],
                    msg: 'success',
                });
            }
        });
    },
    save(req, res, next) {
        Person.save(req)
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
        Person.delete(req.query.Id)
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
                    msg: '人员删除失败' + e,
                });
            });
    },
}