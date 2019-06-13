const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').files;
const moment = require('moment')
const {
    getUuid,
    writeFile,
    removeFile
} = require('../utils/utils');

module.exports = {
    // 分页查询
    getByPage(params) {
        let sqlStr = `select * from files`;
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
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null' && a[0].indexOf('time') === -1) ? ` ${a[0]} like '%${a[1]}%'` : '') +
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
        let sqlStr = `select count(*) from files`;
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
                sqlStr += ((a[1] !== 'notNull' && a[1] !== 'null' && a[0].indexOf('time') === -1) ? ` ${a[0]} like '%${a[1]}%'` : '') +
                    (a[1] === 'null' ? ` ${a[0]} is null` : '') +
                    (a[1] === 'notNull' ? ` ${a[0]} is not null` : '') +
                    (/,/g.test(a[1]) ? ` ${a[0]} between '${a[1].split(',')[0]}' and '${a[1].split(',')[1]}'` : '') +
                    (index === queryParams.length - 1 ? '' : ' and');
            });
        }
        return _.query(sqlStr);
    },
    save(req, res, next) {
        const Id = req.body.Id || getUuid();
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                writeFile('template', Id, file);
            });
            req.body.file_path = ((req.body.file_path !== 'null' && req.body.file_path) ? req.body.file_path + ',' : '') + req.files.map(val => `${Id}_${val.originalname}`).toString();
        }
        if (!req.body.Id) {
            const {
                name,
                writer_id,
                file_path
            } = req.body;
            return _.query($sqlQuery.add, [Id, name, file_path ? file_path : null, writer_id]);
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
        return _.query($sqlQuery.queryById, [id])
        .then(result=>{
           if(result.length>0){
               removeFile('./upload/template/'+result[0].file_path);
               return _.query($sqlQuery.delete,id);
           }
        })
    },
};