const usuario = require('./classes/usuario.js');
const rede_social = require('./classes/rede_social.js');

function getBlobFromBase64(imagem_blob) {
    const base64Data = imagem_blob.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer;
}

module.exports = {
    usuario,
    getBlobFromBase64,
    rede_social
}