const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').expenditure;
const moment=require('moment')
const {
    getUuid,
    writeFile
} = require('../utils/utils');

module.exports = {
    // 分页查询
    getByPage(params) {
        let sqlStr = `select * from expenditure`;
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

        return _.query(sqlStr + ` order by ${params.sorter.substring(0,params.sorter.lastIndexOf('_'))} ${params.sorter.substring(params.sorter.lastIndexOf('_')+1)==='ascend'?'asc':'desc'} limit ${(params.pageNum-1) * params.pageSize},${params.pageSize}`);
    },
    // 计算总数
    getSum(params) {
        let sqlStr = `select count(*) from expenditure`;
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
            });
        }
        return _.query(sqlStr);
    },
    getBySendTime(params) {
        let sqlStr = `select sum(money) from expenditure where send_time between '${params.startTime}' and '${params.endTime}'`;
        return _.query(sqlStr).then(data=>({
            data,
            month:moment(params.startTime).format('MM'),
        }))
    },
    save(req, res, next) {
        const Id = req.body.Id || getUuid();
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                writeFile('expenditure', Id, file);
            });
            req.body.file_path = ((req.body.file_path !== 'null' && req.body.file_path) ? req.body.file_path + ',' : '') + req.files.map(val => `${Id}_${val.originalname}`).toString();
        }
        if (!req.body.Id) {
            const {
                project_id,
                applyperson_id,
                alipay_num,
                description,
                money,
                file_path
            } = req.body;
            return _.query($sqlQuery.add, [Id, project_id, applyperson_id, alipay_num, description, money, file_path ? file_path : null])
                .then(() => _.query($sqlQuery.queryById, Id));
        } else {
            let params = {
                ...req.body,
            };
            Object.keys(params).forEach(val => {
                (params[val] === 'null' || params[val] === '') && (params[val] = null);
            });

            delete params.Id;
            delete params.upd_time;
            delete params.files;
            delete params.opt;

            return _.query($sqlQuery.upd, [params, Id]);
        }
    },
    delete(id) {
        return _.query($sqlQuery.delete, [id]);
    },
};