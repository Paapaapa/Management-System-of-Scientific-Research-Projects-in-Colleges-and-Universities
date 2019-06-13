const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').applyZCheck;
const {
    getUuid
} = require('../utils/utils');

module.exports = {
    getByProjectId(project_id) {
        return _.query($sqlQuery.queryByProjectId, project_id);
    },
    save(req, res, next) {
        const Id = req.body.Id || getUuid();
        if (!req.body.Id) {
            const {
                project_id,
                expert_id,
                comment,
                is_passed
            } = req.body;
            return _.query($sqlQuery.add, [Id, project_id, expert_id, comment,is_passed]);
        } else {
            let params = {
                ...req.body,
            };

            delete params.Id;
            delete params.upd_time;

            return _.query($sqlQuery.upd, [params, Id]);
        }
    },
    delete(project_id) {
        return _.query($sqlQuery.delete, [project_id]);
    },
};