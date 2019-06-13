//const moment = require('moment');
const _ = require('./query');
const {
    writeFile
} = require('../utils/utils');
const $sqlQuery = require('./sqlCRUD').person;

const user = {
    // 登录校验
    checkPerson(person) {
        return _.query($sqlQuery.loginCheck, [person.pid, person.pwd]);
    },
    getSelect(role) {
        return _.query(role ? $sqlQuery.queryByRole : $sqlQuery.queryAll, [role]);
    },
    getAvatar() {
        return _.query($sqlQuery.queryAll);
    },
    getById(person) {
        return _.query($sqlQuery.queryById, [person.pid]);
    },
    // 分页查询
    getByPage(params) {
        console.log(params)
        let sqlStr = `select * from person`;
        let temp = {
            ...params
        };
        delete temp.pageNum;
        delete temp.pageSize;
        delete temp.sorter;
        let queryParams = Object.entries(temp);
        if (queryParams.length > 0) {
            sqlStr += ` where`;
            queryParams.forEach((a, index) => {
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null'&& a[0].indexOf('time') === -1) ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (/,/g.test(a[1]) ? ` ${a[0]} between '${a[1].split(',')[0]}' and '${a[1].split(',')[1]}'` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            });
        }
        if (params.pageNum > 0 && params.pageSize > 0)
            return _.query(sqlStr + ` order by ${params.sorter.substring(0,params.sorter.lastIndexOf('_'))} ${params.sorter.substring(params.sorter.lastIndexOf('_')+1)==='ascend'?'asc':'desc'} limit ${(params.pageNum-1) * params.pageSize},${params.pageSize}`);
        else
            return _.query(sqlStr + ` order by ${params.sorter.substring(0,params.sorter.lastIndexOf('_'))} ${params.sorter.substring(params.sorter.lastIndexOf('_')+1)==='ascend'?'asc':'desc'}`);
    },
    // 计算总数
    getSum(params) {
        let sqlStr = `select count(*) from person`;
        let temp = {
            ...params
        };
        delete temp.pageNum;
        delete temp.pageSize;
        delete temp.sorter;
        let queryParams = Object.entries(temp);
        if (queryParams.length > 0) {
            sqlStr += ` where`;
            queryParams.forEach(function (a, index) {
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null'&& a[0].indexOf('time') === -1) ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (/,/g.test(a[1]) ? ` ${a[0]} between '${a[1].split(',')[0]}' and '${a[1].split(',')[1]}'` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            })
        }
        return _.query(sqlStr);
    },
    save(req) {
        const Id = req.body.Id;
        if (req.body.action === 'add') {
            const {
                password,
                role,
            } = req.body;
            return _.query($sqlQuery.add, [Id, Id, password, role]);
        } else {
            if (req.files && req.files.length > 0) {
                req.files.forEach((file) => {
                    writeFile('avatar', Id, file);
                });
                req.body.avatar = `${Id}_${req.files[0].originalname}`;
            }
            let params = {
                ...req.body,
            };

            delete params.Id;
            delete params.upd_time;
            delete params.files;

            return _.query($sqlQuery.upd, [params, Id]);
        }
    },
    delete(id) {
        return _.query($sqlQuery.delete, [id]);
    },
};

module.exports = user;