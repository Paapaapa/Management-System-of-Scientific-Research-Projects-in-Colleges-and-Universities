const ProjectApply = require('../dao/projectApply');
const proposal = require('../dao/proposal');
const notice = require('../dao/notice');
const zcheck = require('../dao/applyZCheck');
const sign = require('../dao/applySign');
const moment = require('moment');

module.exports = {
    // 分页查询
    getByPage(req, res, next) {
        const resData = {
            pageNum: req.query.pageNum,
            pageSize: req.query.pageSize
        };
        ProjectApply.getSum(req.query)
            .then((sum) => {
                if (sum && sum.length) {
                    resData['total'] = sum[0]['count(*)'];
                    return ProjectApply.getByPage(req.query);
                }
            })
            .then((data) => {
                if (data) {
                    resData['list'] = data;
                    Promise.all(data.map((val, index) => {
                        return sign.getByProjectId(val.Id)
                            .then(children => {
                                resData['list'][index]['sign'] = children;
                            });
                    }).concat(data.map((val, index) => {
                        return zcheck.getByProjectId(val.Id)
                            .then(children => {
                                resData['list'][index]['zcheck'] = children;
                            });
                    }))).then(() => {
                        res && res.json({
                            code: 1,
                            data: resData,
                            msg: '操作成功',
                        });
                    })
                }
            })
            .catch((e) => {
                res.json({
                    result: -1,
                    msg: '获取项目申报信息失败' + JSON.stringify(e)
                })
            });
    },
    getSelect(req, res, next) {
        const obj = {};
        const principal = (req && req.query.principal_id) || undefined;
        ProjectApply.getSelect(principal)
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
    save(req, res, next) {
        const person = require('./person').getSelect();
        ProjectApply.save(req, res, next)
            .then((data) => {
                if (data) {
                    if (req.body.opt === 'finish') {
                        console.log('begin insert proposal···')
                        proposal.save({
                            body: {
                                project_id: req.body.Id,
                                principal_id: req.body.principal_id,
                            }
                        }).then(proposal => {
                            notice.save({
                                sendman_id: null,
                                acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                content: `新项目${req.body.name}已立项，请尽快设置截止时间`,
                                type: '1-3',
                                target_id: proposal[0].Id,
                            });
                            notice.save({
                                sendman_id: null,
                                acceptman_id: proposal[0].principal_id,
                                content: `您的项目-${req.body.name}已进入开题阶段，等待管理员设置截止时间`,
                                type: '1-2',
                                target_id: proposal[0].Id,
                            });
                        })
                    }

                    // 申请初审时删除关于这条项目的所有专家评审记录
                    if (req.body.status === 3) {
                        zcheck.delete(req.body.Id);
                    }

                    // 消息通知
                    switch (Number(req.body.status)) {
                        case 0:
                            if (req.body.opt == 'rollback') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}撤销了项目-${req.body.name}的申报`,
                                    type: '0-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt === 'remain') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}恢复了新项目-${req.body.name}的申报，请尽快审核材料`,
                                    type: '0-4',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'add') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}申报了新项目-${req.body.name}，请尽快审核材料`,
                                    type: '0-4',
                                    target_id: data[0].Id,
                                });
                            }
                            break;
                        case 1:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.principal_id,
                                content: `您申报的项目-${req.body.name}通过了初审`,
                                type: '0-3',
                                target_id: req.body.Id,
                            });
                            notice.save({
                                sendman_id: null,
                                acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                content: `新项目-${req.body.name}已通过初审，请尽快分配专家`,
                                type: '0-5',
                                target_id: req.body.Id,
                            });
                            break;
                        case 2:
                            if (req.body.opt == 'fcheck') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `您申报的项目-${req.body.name}未通过初审`,
                                    type: '0-3',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 3:
                            if (req.body.opt == 'apply') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                    content: `${person[req.body.principal_id]}对项目-${req.body.name}申请重新初审，请尽快前往初审`,
                                    type: '0-4',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 4:
                            if (req.body.opt == 'reassign') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `管理员${person[req.body.assignman_id]}为您申报的项目-${req.body.name}重新指定了专家进行评审`,
                                    type: '0-3',
                                    target_id: req.body.Id,
                                });
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.expert_ids,
                                    content: `管理员${person[req.body.assignman_id]}指定了您为新项目-${req.body.name}的评审专家，请尽快前往评审`,
                                    type: '0-6',
                                    target_id: req.body.Id,
                                });
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.oexpert_ids,
                                    content: `抱歉，管理员${person[req.body.assignman_id]}取消了您对新项目-${req.body.name}的评审资格`,
                                    type: '0-6',
                                    target_id: req.body.Id,
                                });
                            } else if (req.body.opt == 'assign') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `管理员${person[req.body.assignman_id]}为您申报的项目-${req.body.name}指定了专家进行后期的评审`,
                                    type: '0-3',
                                    target_id: req.body.Id,
                                });
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.expert_ids,
                                    content: `管理员${person[req.body.assignman_id]}指定了您为新项目-${req.body.name}的评审专家，请尽快前往评审`,
                                    type: '0-6',
                                    target_id: req.body.Id,
                                });
                            }
                            break;
                        case 6:
                            notice.save({
                                sendman_id: null,
                                acceptman_id: req.body.principal_id,
                                content: `恭喜您，您申报的项目-${req.body.name}已成功立项`,
                                type: '0-3',
                                target_id: req.body.Id,
                            });
                            break;
                        case 7:
                            if (req.body.opt == 'finish') {
                                notice.save({
                                    sendman_id: null,
                                    acceptman_id: req.body.principal_id,
                                    content: `抱歉，您申报的项目-${req.body.name}立项失败`,
                                    type: '0-3',
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
                    msg: '项目申报失败' + e,
                });
            });
    },
    delete(req, res, next) {
        ProjectApply.delete(req.query.Id)
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
                    msg: '项目申报撤销失败' + e,
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
        // 月总立项数
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
                ProjectApply.getByEstablished(value)
                .then(res => ({
                    x: moment(res.time).format('YYYY-MM'),
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