module.exports = {
    //Convert Blob to Base64
    blob_toBase64(blob) {
        const base64 = Buffer.from(blob).toString('base64');
        return base64;
    },
    
    //Convert Base64 to Blob
    base64_toBlob(base64) {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        return buffer;
    },

    //Formatar Base64 para enviar ao cliente
    format_base64(base64, extension = 'png') {
        const formatted = `data:image/${extension};base64,${base64}`;
        return formatted;
    }
}