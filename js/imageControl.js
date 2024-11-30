function controlImageInForms() {
    const perfil_btn = document.getElementById('button_perfil')
    if (!perfil_btn.classList.contains('g')) {
        perfil_btn.classList.add('g')
        perfil_btn.querySelector('label').textContent = 'Sim'
    }
}

function controlImage(id='imagem_perfil', imgElm = 'imagem_img') {
    const imgField = document.getElementById(id);
    const imgElement = document.getElementById(imgElm);
    imgField.addEventListener('change', (e) => {
        const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgElement.src= e.target.result;
                    controlImageInForms()
                };
                reader.readAsDataURL(file);
            }
    });
}

async function getImageToForm(inputId = 'imagem_perfil_blob', imgId = 'imagem_img') {
    const inputImgBlob = document.getElementById(inputId);
    const img = document.getElementById(imgId);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    //Get blob
    function getCanvasBlob() {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(blob)
                } else {
                    resolve(blob)
                }
            })
        })
    }

    //Convert Blob to Base64
    function getBase64FromBlob(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob)
        })
    }

    //Let blob live
    try {
        const img_blob = await getCanvasBlob();
        const imgBase64 = await getBase64FromBlob(img_blob);
        inputImgBlob.value = imgBase64;
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
    }
}