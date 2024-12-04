const DB_DEFAULT = require('../db_init.js').DB_DEFAULT;

module.exports = {
    cadastrar(usuario_id, rede_nome, perfil, db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO redes_sociais(usuario_id, rede_nome, perfil) VALUES (?,?,?);';
            db.run(query, [usuario_id, rede_nome, perfil], (err) => {
                if (err) {
                    console.error('Err in Add RdSc: ', err.message)
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}