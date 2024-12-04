const DB_DEFAULT = require('../db_init.js').DB_DEFAULT;

module.exports = {
    obterTodas(db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM formacoes;';
            db.all(query, [], (err, rows) => {
                if (err) {
                    console.error('Get User Email', err.message)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    },
}