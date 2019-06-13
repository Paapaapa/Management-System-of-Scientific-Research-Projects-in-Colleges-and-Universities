const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').applySign;
const {
    getUuid
} = require('../utils/utils');

module.exports = {
    getByProjectId(project_id) {
        return _.query($sqlQuery.queryByProjectId, project_id);
    },
    getBySign(params) {
        return _.query($sqlQuery.queryBySign, [params.signman_id,(params.pageNum-1) * params.pageSize,params.pageSize-0]);
    },
    countBySign(signman_id) {
        return _.query($sqlQuery.countBySign,signman_id);
    },
    save(req, res, next) {
        const Id = req.body.Id || getUuid();
        if (!req.body.Id) {
            const {
                project_id,
                signman_id,
                sign_reason,
            } = req.body;
            return _.query($sqlQuery.add, [Id, project_id, signman_id, sign_reason]);
        } else {
            let params = {
                ...req.body,
            };

            delete params.Id;
            delete params.upd_time;
            delete params.name;
            delete params.principal_id;

            return _.query($sqlQuery.upd, [params, Id]);
        }
    },
    delete(id) {
        return _.query($sqlQuery.delete, [id]);
    },
};