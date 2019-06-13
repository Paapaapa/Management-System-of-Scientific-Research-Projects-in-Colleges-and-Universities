const applyZCheck = require('../dao/applyZCheck');
const projectApply = require('../dao/projectApply');
const notice = require('../dao/notice');

module.exports = {
    getByProject(req, res, next) {
        applyZCheck.getByProjectId(req.query.project_id)
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
    save(req, res, next) {
        const person = require('./person').getSelect();
        applyZCheck.save(req, res, next)
            .then((data) => {
                if (data) {
                    let projectId = req.body.project_id;
                    let ecount = 0;
                    projectApply.getById(projectId)
                        .then(project => {
                            if (project) {
                                ecount = project[0].expert_ids.split(',').length;
                                applyZCheck.getByProjectId(projectId)
                                    .then(zcheck => {
                                        if (zcheck) {
                                            if (zcheck.length === ecount) {
                                                projectApply.save({
                                                    body: {
                                                        Id: project[0].Id,
                                                        status: 5,
                                                    }
                                                }).then(data => {
                                                    notice.save({
                                                        sendman_id: null,
                                                        acceptman_id: project[0].principal_id,
                                                        content: `您的项目-${project[0].name}所有专家已评审完毕`,
                                                        type: '0-3',
                                                        target_id: project[0].Id,
                                                    });
                                                    notice.save({
                                                        sendman_id: null,
                                                        acceptman_id: Object.keys(person).filter(val => val.indexOf('g') > -1).toString(),
                                                        content: `项目-${project[0].name}的所有专家已评审完毕,请尽快进行立项管理`,
                                                        type: '0-7',
                                                        target_id: project[0].Id,
                                                    });
                                                })
                                            }
                                        }
                                    })
                            }
                        });
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
        applyZCheck.delete(req.query.project_id)
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