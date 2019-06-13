const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').announce;
const moment = require('moment');
const getUuid = require('../utils/utils').getUuid;

module.exports = {
    getByPage(params) {
        let sqlStr = `select * from announce`;
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
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null') ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            });
        }

        return _.query(sqlStr + ` order by ${params.sorter.substring(0,params.sorter.lastIndexOf('_'))} ${params.sorter.substring(params.sorter.lastIndexOf('_')+1)==='ascend'?'asc':'desc'} limit ${(params.pageNum-1) * params.pageSize},${params.pageSize}`);
    },
    // 计算总数
    getSum(params) {
        let sqlStr = `select count(*) from announce`;
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
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null') ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            })
        }
        return _.query(sqlStr);
    },
    save(obj) {
        if (!obj.Id)
            return _.query($sqlQuery.add, [getUuid(), obj.title, obj.content,obj.writer_id]);
        else {
            let params = {
                ...obj,
            };
            delete params.Id;
            delete params.upd_time;
            return _.query($sqlQuery.upd, [params, obj.Id]);
        }
    },
    delete(id) {
        return _.query($sqlQuery.delete, [id]);
    },
};