// MODULES --------------------------------------------------------------------
const fs = require('fs');
const sha1 = require('sha1');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express()
const session = require('express-session');

const db = require('./server/db_manage.js');
// MODULE CONFIGURATION -------------------------------------------------------

// setup directories
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
//body-parser
app.use(bodyParser.urlencoded({extended: true}));
//cookie-parser
app.use(cookieParser())
//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'));
//session
app.use(session({
    secret: 'log_key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// SETUP ----------------------------------------------------------------------
//https://www.w3schools.com/nodejs/nodejs_email.asp
const SERVER_EMAIL = 'criadordeportfolios@gmail.com';
const SERVER_PASSWORD = '*criar1704*'
const SERVER_PORT = 1101;

// ROUTES ---------------------------------------------------------------------
function getImageFromFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    });
}

// Auth
app.get('/', async (req, res) => {
    res.redirect('/login');
});

app.get('/login', async (req, res) => {
    const userID = req.cookies['login'];
    if (userID) {
        req.session.user = await db.usuario.buscarPorId(userID);
        return res.redirect('/menu');
    }

    res.render('sys_login');
})

app.post('/login', async (req, res) => {
    const {email, senha, lembrar} = req.body;
    const user = await db.usuario.buscarPorEmail(email);
    if (!user || user.hash_senha != sha1(senha)) {
        res.redirect('/login?e=1')
    } else {
        delete user.hash_senha;
        req.session.user = user;

        if (lembrar && !req.cookies['login']) {
            const endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 10);

            res.cookie('login', user.usuario_id, {
                expires: endDate,
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            });
        }

        res.redirect('/menu')
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/menu');
        }
        res.clearCookie('login');
        res.redirect('/login');
    });
});

async function verificarLogin(req, res, next) {
    const userID = req.cookies['login'];
    if (userID) {
        req.session.user = await db.usuario.buscarPorId(userID);
    }
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Usuario
app.get('/usuario/cadastrar', (req, res) => {
    res.render('usuario_cadastrar');
});

app.post('/usuario/cadastrar', async (req, res) => {
    const {nome, email, senha, descricao, imagem_blob} = req.body;
    const user = await db.usuario.buscarPorEmail(email);
    if (user) {
        return res.redirect('/usuario/cadastrar?e=1');
    } else {
        const usuarioId = await db.usuario.cadastrar(nome, email, senha, descricao, db.getBlobFromBase64(imagem_blob));
        const socialMedial_IDs = [];
        for (const key in req.body) {
            if (key.includes('rs-name-')) {
                const mediaID = Number(key.split('name-')[1])
                if (!socialMedial_IDs.includes(mediaID)) {
                    socialMedial_IDs.push(mediaID)
                }
            }
        }
        for (const mediaID of socialMedial_IDs) {
            const rede_nome = req.body[`rs-name-${mediaID}`]
            const perfil = req.body[`rs-perfil-${mediaID}`]
            await db.rede_social.cadastrar(usuarioId, rede_nome, perfil);
        }
        res.redirect('/login?s=1');
    }
});

// Home
app.get('/menu', verificarLogin, (req, res) => {
    const user = req.session.user;
    res.send(user);
});

// INIT -----------------------------------------------------------------------
app.listen(SERVER_PORT, () => {
    console.log(`Opened in: http://localhost:${SERVER_PORT}`);
});