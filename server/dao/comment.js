const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').comment;
const {
    getUuid
} = require('../utils/utils');

module.exports = {
    getByPage(params) {
        let sqlStr = `select * from comment`;
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
    getSum(params) {
        let sqlStr = `select count(*) from comment where`;
        let temp = {
            ...params
        };
        delete temp.pageNum;
        delete temp.pageSize;
        delete temp.sorter;
        let queryParams = Object.entries(temp);
        if (queryParams.length > 0) {
            queryParams.forEach((a, index) => {
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null') ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            });
        }
        return _.query(sqlStr);
    },
    getAll(params) {
        let sqlStr = `select * from comment where`;
        const queryParams = Object.entries(params);
        queryParams.forEach((a, index) => {
            if (a[0] !== 'pageNum' && a[0] !== 'pageSize') {
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null') ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            }
        });

        return _.query(sqlStr + ` order by upd_time desc`);
    },
    save(obj) {
        const Id = obj.Id || getUuid();
        if (!obj.Id) {
            const {
                fruit_id,
                writer_id,
                content,
                replyto_id,
                replyto_person_id
            } = obj;
            return _.query($sqlQuery.add, [Id, fruit_id, writer_id, content, replyto_id ? replyto_id : null, replyto_person_id ? replyto_person_id : null])
                .then(() => _.query($sqlQuery.queryById, Id));
        } else {
            let params = {
                ...obj,
            };

            delete params.Id;
            delete params.upd_time;

            return _.query($sqlQuery.upd, [params, Id]);
        }
    },
    delete(id) {
        return _.query($sqlQuery.delete, [id]);
    },
};