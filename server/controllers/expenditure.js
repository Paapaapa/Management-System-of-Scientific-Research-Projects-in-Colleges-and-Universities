const expenditure = require('../dao/expenditure');
const notice = require('../dao/notice');
const moment = require('moment');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        expenditure.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return expenditure.getByPage(req.query);
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
            .catch((e) => {
                console.log(e)
                res.json({
                    result: -1,
                    msg: '获取经费申请信息失败，错误原因：' + JSON.stringify(e)
                })
            });
    },
    save(req, res, next) {
        const person = require('./person').getSelect();
        const project = require('./projectApply').getSelect();
        expenditure.save(req)
            .then((data) => {
                if (data) {
                    // 消息通知
                    switch (Number(req.body.status)) {
                        case 0:
                            if (req.body.opt == 'rollback') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.applyperson_id]}撤销了项目-${project[req.body.project_id]}的经费申请`,
                                    type: '4-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'remain') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.applyperson_id]}恢复了项目-${project[req.body.project_id]}的经费申请，请尽快审批`,
                                    type: '4-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'add') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.applyperson_id]}提交了项目-${project[req.body.project_id]}的经费申请，请尽快审批`,
                                    type: '4-4',
                                    target_id: data[0].Id,
                                });
                            }
                            break;
                        case 1:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.applyperson_id,
                                content: `您申请的经费已通过审批`,
                                type: '4-3',
                                target_id: req.body.Id,
                            });
                            break;
                        case 2:
                            if (req.body.opt == 'check') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.applyperson_id,
                                    content: `您申请的经费未通过审批`,
                                    type: '4-3',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 3:
                            if (req.body.opt == 'apply') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.applyperson_id]}申请重新审批，请尽快处理`,
                                    type: '4-4',
                                    target_id: req.body.Id,
                                });
                            }
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
            .catch((e) => {
                console.log(e)
                res.json({
                    code: 0,
                    msg: '操作失败，错误原因：' + e,
                });
            });
    },
    delete(req, res, next) {
        expenditure.delete(req.query.Id)
            .then((data) => {
                console.log(data);
                if (data) {
                    res.json({
                        code: 1,
                        data,
                        msg: 'success',
                    });
                }
            })
            .catch((e) => {
                console.log(e)
                res.json({
                    code: 0,
                    msg: '经费申请撤销失败，错误原因：' + e,
                });
            });
    },
    // 柱状图和总额
    getCharts(req, res, next) {
        let lastM = '';
        let lastMFirst = ''; // 上月第一天
        let lastMEnd = ''; // 上月最后一天
        let searchArray = [];
        // 月总金额
        for (let i = 0; i < 12; i++) {
            lastM = moment().subtract(i + 1, 'M');
            lastMFirst = moment(new Date(lastM.format('YYYY-MM-') + '01')).format('YYYY-MM-DD 00:00:00'); // 上月第一天
            lastMEnd = moment(new Date(lastM.format('YYYY'), lastM.format('MM'), 0)).format('YYYY-MM-DD 23:59:59'); // 上月最后一天
            // let val = ((month) => expenditure.getBySendTime({
            //     startTime: lastMFirst,
            //     endTime: lastMEnd,
            // }).then(data => {
            //     if (data) {
            //         resData.push({
            //             x: `${month}月`,
            //             y: data.reduce((sum, cur, index, array) => parseFloat(cur.money) + sum, 0)
            //         });
            //     }
            // }))(lastM.format('MM'));
            // searchArray.push(val);
            searchArray.unshift({
                startTime: lastMFirst,
                endTime: lastMEnd,
            });
        }

        Promise.all(searchArray.map((value, index) =>
                expenditure.getBySendTime(value)
                .then(res => ({
                    x: `${parseInt(res.month)<10?res.month[1]:res.month}月`,
                    y: res.data[0]['sum(money)'] == null ? 0 : res.data[0]['sum(money)'],
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
    }
}