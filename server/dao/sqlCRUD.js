// 用户
const person = {
    loginCheck: 'select * from person where id=? and password=?',
    queryAll: 'select * from person',
    queryById: 'select * from person where id=?',
    queryByRole: 'select * from person where role=? and is_passed=1 and del_flag=0',
    add: 'insert into person (Id,name,password,role) values (?,?,?,?)',
    upd: 'update person set ? where id=?',
    delete: 'delete from person where id=?',
};

// 项目申报
const projectApply = {
    queryById: 'select * from project_apply where id=?',
    queryByPrincipal: 'select * from project_apply where principal_id=?',
    queryAll: 'select * from project_apply',
    queryByPage: 'select * from project_apply limit ?,?',
    count: 'select count(*) from project_apply',
    add: 'insert into project_apply (Id,name,description,principal_id,category_id,file_path,money,period,fruit,end_time) values (?,?,?,?,?,?,?,?,?,?)',
    upd: 'update project_apply set ? where id=?',
    delete: 'delete from project_apply where id=?',
};

// 项目申报-专家评审
const applyZCheck = {
    queryByProjectId: 'select * from apply_zcheck where project_id=?',
    add: 'insert into apply_zcheck (Id,project_id,expert_id,comment,is_passed) values (?,?,?,?,?)',
    upd: 'update apply_zcheck set ? where id=?',
    delete: 'delete from apply_zcheck where project_id=?',
};

// 项目申报-选题管理
const applySign = {
    queryByProjectId: 'select * from apply_sign where project_id=?',
    queryBySign: 'select a.Id,a.project_id,b.name,b.end_time,b.principal_id,a.sign_reason,a.signman_id,a.is_checked from apply_sign a,project_apply b where signman_id=? and a.project_id=b.Id order by a.upd_time limit ?,?',
    countBySign: 'select count(*) from apply_sign a,project_apply b where signman_id=? and a.project_id=b.Id',
    add: 'insert into apply_sign (Id,project_id,signman_id,sign_reason) values (?,?,?,?)',
    upd: 'update apply_sign set ? where id=?',
    delete: 'delete from apply_sign where id=?',
};

// 项目类别
const projectCategory = {
    queryAll: 'select * from project_category',
    queryByPage: 'select * from project_category limit ?,?',
    count: 'select count(*) from project_category',
    add: 'insert into project_category (Id,name,description) values (?,?,?)',
    upd: 'update project_category set ? where id=?',
    delete: 'delete from project_category where id=?',
};

// 项目中止
const stop = {
    queryAll: 'select * from stop',
    queryByPage: 'select * from stop limit ?,?',
    count: 'select count(*) from stop',
    add: 'insert into stop (Id,project_id,reason,principal_id) values (?,?,?,?)',
    upd: 'update stop set ? where id=?',
    delete: 'delete from stop where id=?',
};

// 经费
const expenditure = {
    queryById: 'select * from expenditure where id=?',
    queryAll: 'select * from expenditure',
    queryByPage: 'select * from expenditure limit ?,?',
    count: 'select count(*) from expenditure',
    add: 'insert into expenditure (Id,project_id,applyperson_id,alipay_num,description,money,file_path) values (?,?,?,?,?,?,?)',
    upd: 'update expenditure set ? where id=?',
    delete: 'delete from expenditure where id=?',
};

// 成果
const fruit = {
    queryById: 'select * from fruit where id=?',
    queryAll: 'select * from fruit',
    queryByPage: 'select * from fruit limit ?,?',
    count: 'select count(*) from fruit',
    add: 'insert into fruit (Id,project_id,category_id,description,principal_id,file_path) values (?,?,?,?,?,?)',
    upd: 'update fruit set ? where id=?',
    delete: 'delete from fruit where id=?',
};

// 通知
const notice = {
    queryAll: 'select * from notice',
    queryByPage: 'select * from notice limit ?,?',
    count: 'select count(*) from notice',
    add: 'insert into notice (Id,sendman_id,acceptman_id,content,type,target_id) values (?,?,?,?,?,?)',
    upd: 'update notice set ? where id=?',
    delete: 'delete from notice where id=?',
};

// 项目开题
const proposal = {
    queryById: 'select * from proposal where id=?',
    queryByProject: 'select * from proposal where project_id=?',
    queryAll: 'select * from proposal',
    queryByPage: 'select * from proposal limit ?,?',
    count: 'select count(*) from proposal',
    add: 'insert into proposal (Id,project_id,principal_id) values (?,?,?)',
    upd: 'update proposal set ? where id=?',
    delete: 'delete from proposal where id=?',
};

// 中期检查
const midcheck = {
    queryById: 'select * from midcheck where id=?',
    queryByProject: 'select * from midcheck where project_id=?',
    queryAll: 'select * from midcheck',
    queryByPage: 'select * from midcheck limit ?,?',
    count: 'select count(*) from midcheck',
    add: 'insert into midcheck (Id,project_id,principal_id) values (?,?,?)',
    upd: 'update midcheck set ? where id=?',
    delete: 'delete from midcheck where id=?',
};

// 项目结题
const conclude = {
    queryById: 'select * from conclude where id=?',
    queryByProject: 'select * from conclude where project_id=?',
    queryAll: 'select * from conclude',
    queryByPage: 'select * from conclude limit ?,?',
    count: 'select count(*) from conclude',
    add: 'insert into conclude (Id,project_id,principal_id) values (?,?,?)',
    upd: 'update conclude set ? where id=?',
    delete: 'delete from conclude where id=?',
};

// 成果评价
const comment = {
    queryById: 'select * from comment where id=?',
    queryAll: 'select * from comment',
    queryByPage: 'select * from comment limit ?,?',
    count: 'select count(*) from comment',
    add: 'insert into comment (Id,fruit_id,writer_id,content,replyto_id,replyto_person_id) values (?,?,?,?,?,?)',
    upd: 'update comment set ? where id=?',
    delete: 'delete from comment where id=?',
};

// 公告
const announce = {
    add: 'insert into announce (Id,title,content,writer_id) values (?,?,?,?)',
    upd: 'update announce set ? where id=?',
    delete: 'delete from announce where id=?',
};

// 文件
const files = {
    queryById: 'select * from files where id = ? ',
    add: 'insert into files (Id,name,file_path,writer_id) values (?,?,?,?)',
    upd: 'update files set ? where id=?',
    delete: 'delete from files where id=?',
};

module.exports = {
    person,
    projectApply,
    projectCategory,
    expenditure,
    fruit,
    notice,
    proposal,
    conclude,
    midcheck,
    comment,
    applyZCheck,
    applySign,
    announce,
    files,
    stop
}