// FALAR COM A ROSÉLIA: MEDALHA OBA E NOTA DO GABRIEL -------------------------

// MODULES --------------------------------------------------------------------
const fs = require('fs');
const sha1 = require('sha1');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const session = require('express-session');

// MODULE CONFIGURATION -------------------------------------------------------

// setup directories
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
//bodyparser
app.use(bodyParser.urlencoded({extended: true}));
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
const SERVER_EMAIL = 'dssenaifinal@gmail.com';
const SERVER_PASSWORD = 'jv!DS!123'
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

app.get('/', async (req, res) => {
    res.redirect('/login')
});

app.get('/login', (req, res) => {
    res.render('sys_login');
})


//Usuario
app.get('/usuario/cadastrar', (req, res) => {
    res.render('usuario_cadastrar');
})


// INIT -----------------------------------------------------------------------
app.listen(SERVER_PORT, () => {
    console.log(`Opened in: http://localhost:${SERVER_PORT}`);
});