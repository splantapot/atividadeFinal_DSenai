// MODULES --------------------------------------------------------------------
const sha1 = require('sha1');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express()
const session = require('express-session');

const db = require('./server/db_manage.js');
const email_manager = require('./server/email_manager.js');
const img_manager = require('./server/img_manager.js');
const process = require('process');
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
//Don't forgot ".env" in server's root!
const SERVER_PORT = 1101;

// ROUTES ---------------------------------------------------------------------

//Middleware check login
async function verificarLogin(req, res, next) {
    const userID = req.cookies['login'];
    if (userID) {
        // console.log('cookie used')
        req.session.user = await db.usuario.buscarPorId(userID);
    }
    if (req.session.user) {
        // console.log('session used')
        req.session.user = await db.usuario.buscarPorEmail(req.session.user.email);
        return next();
    } else {
        res.redirect('/');
    }
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
    } else if (req.session.user) {
        req.session.user = await db.usuario.buscarPorEmail(req.session.user.email);
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

        res.redirect('/template');
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

// Usuario
app.get('/usuario/cadastrar', (req, res) => {
    res.render('usuario_cadastrar');
});

app.post('/usuario/cadastrar', async (req, res) => {
    const {nome, email, senha, descricao, imagem_base64} = req.body;
    const user = await db.usuario.buscarPorEmail(email);
    if (user) {
        return res.redirect('/usuario/cadastrar?e=1');
    } else {
        const usuarioId = await db.usuario.cadastrar(nome, email, senha, descricao, img_manager.base64_toBlob(imagem_base64));
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

app.get('/usuario/recuperar', async (req, res) => {
    res.render('usuario_recuperar_get');
});

app.post('/usuario/recuperar', async (req, res) => {
    const {email, code} = req.body;
    
    if (!code) {
        const codigo = email_manager.gerarCodigoDeVerificacao(8);
    
        await email_manager.enviarEmail(
            email,
            'Recuperação de Email',
            `Código para recuperação do email em "Criador de Portfólios.com": ${codigo}`
        );
    
        res.cookie('verificationCode', codigo, {
            maxAge: 180000,
            httpOnly: true,
            sameSite: 'strict'
        });
    
        return res.render('usuario_recuperar_post', {email});
    } else {
        if (code != req.cookies.verificationCode) {
            return res.render('usuario_recuperar_post', {email, error:1})
        } else {
            res.render('usuario_redefinir', {email});
        }
    }
});

app.post('/usuario/redefinir', async (req, res) => {
    const {email, senha} = req.body;
    await db.usuario.atualizarSenhaDoEmail(senha, email);
    res.redirect('/login?s=2');
})

app.post('/usuario/atualizar', verificarLogin, async (req, res) => {
    const {nome, email, descricao_perfil, imagem_base64} = req.body;
    const user = await db.usuario.buscarPorEmail(email);

    await db.usuario.atualizarDados(user.usuario_id, nome, descricao_perfil, img_manager.base64_toBlob(imagem_base64));
    req.session.user = await db.usuario.buscarPorEmail(email);

    res.redirect('/menu');
});

// Home
app.get('/menu', verificarLogin, async (req, res) => {
    const user = req.session.user;

    const formatted = img_manager.format_base64(
        img_manager.blob_toBase64(user.imagem_perfil)
    );
    user.imagem_perfil = formatted;
    admin = user.email == process.env.SERVER_EMAIL_ADMIN || false;

    delete user.hash_senha;
    delete user.usuario_id;

    res.render('sys_portfolio_template', {user, admin});
});

// Testing
app.get('/picture', (req, res) => {
    res.render('sys_picture');
})

app.get('/template', async (req, res) => {
    const formacoes = await db.formacao.obterTodas();
    const experiencias = await db.experiencia.obterTodas();
    res.render('sys_portfolio_template', {formacoes, experiencias});
})

// Not found
app.get('/not-found', (req, res) => {
    res.send('<h1>Página não encontrada</h1><br><a href="/logout">Voltar para o login</a>')
})

app.post('/contato', async (req, res) => {
    const {nome, email, mensagem} = req.body;
    await email_manager.enviarEmail('jvcr1007@gmail.com.br', `Mensagem de ${nome}`, mensagem)
    await email_manager.enviarEmail(email, `Confirmação`, `Mensagem enviada para o João victor:\n\n"${mensagem}"`);
    res.redirect('/template')
})

// Middleware to error (404) - Not found
app.use((req, res) => {
    res.status(404).redirect('/not-found')
});

// INIT -----------------------------------------------------------------------
app.listen(SERVER_PORT, () => {
    console.log(`Opened in: http://localhost:${SERVER_PORT}`);
});