const sha1 = require('sha1');
const DB_DEFAULT = require('../db_init.js').DB_DEFAULT;

module.exports = {
    // INSERT USERs
    cadastrar(nome, email, senha, descricao_perfil = '', imagem_perfil = '', db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO usuarios(nome, email, hash_senha, descricao_perfil, imagem_perfil) VALUES (?,?,?,?,?)';
            const hash_senha = sha1(senha);
            db.run(query, [nome, email, hash_senha, descricao_perfil, imagem_perfil], function(err) {
                if (err) {
                    console.error('Add user err:', err.message)
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    },

    buscarPorEmail(email, db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            db.get(query, [email], (err, row) => {
                if (err) {
                    console.error('Get User Email', err.message)
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        })
    },

    buscarPorId(usuario_id, db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT nome, email, descricao_perfil, imagem_perfil FROM usuarios WHERE usuario_id = ?';
            db.get(query, [usuario_id], (err, row) => {
                if (err) {
                    console.error('Get User usuario_id', err.message)
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        })
    },

    atualizarSenhaDoEmail(senha, email, db = DB_DEFAULT) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuarios SET hash_senha = ? WHERE email = ?';
            const hash_senha = sha1(senha);
            db.run(query, [hash_senha, email], (err) => {
                if (err) {
                    console.log('Upd Senha via Email err:', err.message);
                    reject(err)
                } else {
                    resolve()
                }
            })
        });
    }
}