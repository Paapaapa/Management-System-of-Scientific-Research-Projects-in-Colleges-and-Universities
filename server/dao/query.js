const pool = require('./connect');

module.exports = {
    /**
     * 通过连接池执行数据CRUD操作
     */
    query: (sqlString, params) => {
        console.log(sqlString)
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sqlString, params, (err, rows) => {
                        if (err) {
                            reject(err)
                            console.log(err)
                        } else {
                            console.log(rows)
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })
    }
}