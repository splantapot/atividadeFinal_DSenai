require('dotenv').config();
const nodemailer = require('nodemailer');

//OBS: NÃO ESQUECA DE CRIAR O .env NA RAIZ, COM O PADRÃO:
//SERVER_EMAIL=email_sem_aspas
//SERVER_SENHA=senha_Sem_aspas

class EmailManager {
    constructor(email, senha) {
        this.email = email;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: senha,
            }
        });
    }

    enviarEmail(paraEmail, assunto, texto) {
        const mailOptions = {
            from: this.email,
            to: paraEmail,
            subject: assunto,
            text: texto
        }

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Send Email Error:', err.message);
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    }
}

const emailManager = new EmailManager(process.env.SERVER_EMAIL, process.env.SERVER_SENHA);

module.exports = emailManager;