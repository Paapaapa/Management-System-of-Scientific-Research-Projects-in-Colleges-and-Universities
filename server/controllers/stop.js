const stop = require('../dao/stop');
const proposal = require('../dao/proposal');
const midcheck = require('../dao/midcheck');
const conclude = require('../dao/conclude');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        stop.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return stop.getByPage(req.query);
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
                res && res.json({
                    result: -1,
                    msg: '服务器出错，错误原因：' + JSON.stringify(e),
                })
            });
    },
    save(req, res, next) {
        stop.save(req.body)
            .then((data) => {
                if (data) {
                    // 更改各阶段的del_flag
                    if (req.body.opt === 'check') {
                        const isPassed = req.body.is_passed;
                        proposal.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    proposal.save({
                                        body: {
                                            Id: data[0].Id,
                                            del_flag: isPassed,
                                        }
                                    })
                                }
                            });
                        midcheck.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    midcheck.save({
                                        body: {
                                            Id: data[0].Id,
                                            del_flag: isPassed,
                                        }
                                    })
                                }
                            });
                        conclude.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    conclude.save({
                                        body: {
                                            Id: data[0].Id,
                                            del_flag: isPassed,
                                        }
                                    })
                                }
                            });
                    }
                    if (req.body.opt === 'apply') {
                        proposal.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    proposal.save({
                                        body: {
                                            Id: data[0].Id,
                                            is_astoped: 1,
                                        }
                                    })
                                }
                            });
                        midcheck.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    midcheck.save({
                                        body: {
                                            Id: data[0].Id,
                                            is_astoped: 1,
                                        }
                                    })
                                }
                            });
                        conclude.getByProject(req.body.project_id)
                            .then(data => {
                                if (data.length > 0) {
                                    conclude.save({
                                        body: {
                                            Id: data[0].Id,
                                            is_astoped: 1,
                                        }
                                    })
                                }
                            });
                    }
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
        stop.delete(req.query.Id)
            .then((data) => {
                if (data) {
                    proposal.getByProject(req.query.project_id)
                        .then(data => {
                            if (data.length > 0) {
                                proposal.save({
                                    body: {
                                        Id: data[0].Id,
                                        is_astoped: 0,
                                    }
                                })
                            }
                        });
                    midcheck.getByProject(req.query.project_id)
                        .then(data => {
                            if (data.length > 0) {
                                midcheck.save({
                                    body: {
                                        Id: data[0].Id,
                                        is_astoped: 0,
                                    }
                                })
                            }
                        });
                    conclude.getByProject(req.query.project_id)
                        .then(data => {
                            if (data.length > 0) {
                                conclude.save({
                                    body: {
                                        Id: data[0].Id,
                                        is_astoped: 0,
                                    }
                                })
                            }
                        });
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