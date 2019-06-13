const fruit = require('../dao/fruit');
const notice = require('../dao/notice');
const moment = require('moment');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        fruit.getSum(req.query)
            .then(function (sum) {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return fruit.getByPage(req.query);
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
                    msg: '获取成果信息失败' + JSON.stringify(e)
                })
            });
    },
    save(req, res, next) {
        const person = require('./person').getSelect();
        const project = require('./projectApply').getSelect();
        fruit.save(req)
            .then(function (data) {
                if (data) {
                    // 消息通知
                    switch (Number(req.body.status)) {
                        case 0:
                            if (req.body.opt == 'rollback') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}撤销了成果登记`,
                                    type: '5-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'remain') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}恢复了成果登记，请尽快初审`,
                                    type: '5-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'add') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}提交了成果登记，请尽快初审`,
                                    type: '5-4',
                                    target_id: data[0].Id,
                                });
                            }
                            break;
                        case 1:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.principal_id,
                                content: `您登记的成果已通过初审`,
                                type: '5-3',
                                target_id: req.body.Id,
                            });
                            notice.save({
                                sendman_id: null,
                                acceptman_id: Object.keys(person).filter(val => val.indexOf('z') > -1).toString(),
                                content: `项目-${project[req.body.project_id]}的成果已通过初审，请尽快评审`,
                                type: '5-5',
                                target_id: req.body.Id,
                            });
                            break;
                        case 2:
                            if (req.body.opt == 'fcheck') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `您登记的成果未通过初审`,
                                    type: '5-3',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 3:
                            if (req.body.opt == 'apply') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}申请重新初审，请尽快审核`,
                                    type: '5-4',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 4:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.principal_id,
                                content: `您登记的成果已通过专家评审`,
                                type: '5-3',
                                target_id: req.body.Id,
                            });
                            notice.save({
                                sendman_id: null,
                                acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                content: `项目-${project[req.body.project_id]}的成果已通过专家评审，请尽快确认`,
                                type: '5-6',
                                target_id: req.body.Id,
                            });
                            break;
                        case 5:
                            if (req.body.opt == 'zcheck') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `您的成果未通过专家评审`,
                                    type: '5-3',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 6:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.principal_id,
                                content: `您的成果已公示`,
                                type: '5-3',
                                target_id: req.body.Id,
                            });
                            break;
                        default:
                            break;
                    }

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
        fruit.delete(req.query.Id)
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
                    msg: '成果申报撤销失败' + e,
                });
            });
    },
    // 图表数据
    getCharts(req, res, next) {
        let lastM = '';
        let lastMFirst = ''; // 上月第一天
        let lastMEnd = ''; // 上月最后一天
        let searchArray = [];
        let months = req.query.opt === 'g' ? 12 : 6;
        for (let i = 0; i < months; i++) {
            lastM = moment().subtract(i + 1, 'M');
            lastMFirst = moment(new Date(lastM.format('YYYY-MM-') + '01')).format('YYYY-MM-DD 00:00:00'); // 上月第一天
            lastMEnd = moment(new Date(lastM.format('YYYY'), lastM.format('MM'), 0)).format('YYYY-MM-DD 23:59:59'); // 上月最后一天
            searchArray.unshift({
                startTime: lastMFirst,
                endTime: lastMEnd,
            });
        }
        Promise.all(searchArray.map((value, index) =>
                fruit.getByConfirmed(value)
                .then(res => ({
                    x: req.query.opt === 'g' ? `${parseInt(moment(res.time).format('MM'))}月` : moment(res.time).format('YYYY-MM'),
                    y: res.data[0]['count(*)'],
                }))
            ))
            .then((data) => {
                res && res.json({
                    code: 1,
                    data,
                    msg: 'success',
                })
            }).catch(err => {
                console.log(err);
                res && res.json({
                    code: -1,
                    msg: '服务器出错，错误原因：' + err,
                })
            });
    },
}