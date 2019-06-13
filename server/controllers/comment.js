const comment = require('../dao/comment');
const notice = require('../dao/notice');
const fruit = require('../dao/fruit');

module.exports = {
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10,
        };
        comment.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return comment.getByPage(req.query);
                }
            })
            .then((data) => {
                if (data) {
                    resData['list'] = data;
                    if (data.length > 0) {
                        Promise.all(data.map((val, index) => {
                            return comment.getAll({
                                fruit_id: req.query.fruit_id,
                                replyto_id: val.Id,
                            }).then(children => {
                                resData['list'][index]['children'] = children;
                            });
                        })).then(() => {
                            res && res.json({
                                code: 1,
                                data: resData,
                                msg: '操作成功',
                            });
                        })
                    }
                } else {
                    res && res.json({
                        code: 0,
                        data: resData,
                        msg: '操作失败',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res && res.json({
                    code: -1,
                    msg: '服务器出错，错误原因：' + JSON.stringify(e)
                })
            });
    },
    save(req, res, next) {
        const person = require('./person').getSelect();
        comment.save(req.body)
            .then((data) => {
                if (data && data.length > 0) {
                    fruit.getById(data[0].fruit_id)
                        .then(fruit => {
                            if (fruit) {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: fruit.principal_id,
                                    content: `${person[data[0].writer_id]}参与了您的成果评价，前往查看`,
                                    type: '5-a',
                                    target_id: data[0].fruit_id,
                                });
                                data[0].replyto_person_id && notice.save({
                                    sendman_id: null,
                                    acceptman_id: data[0].replyto_person_id,
                                    content: `${person[data[0].writer_id]}回复了您的评价，前往查看`,
                                    type: '5-a',
                                    target_id: data[0].fruit_id,
                                });
                            }
                        })

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
                    msg: '服务器出错，错误原因：' + e,
                });
            });
    },
    delete(req, res, next) {
        comment.delete(req.query.Id)
            .then((data) => {
                if (data) {
                    comment.getAll({
                            replyto_id: req.query.Id,
                        })
                        .then(children => {
                            Promise.all(children.map(val => comment.delete(val.Id)))
                                .then(() => {
                                    res && res.json({
                                        code: 1,
                                        data,
                                        msg: '操作成功',
                                    });
                                });
                        })
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
                    msg: '服务器出错，错误原因：' + e,
                });
            });
    },
}