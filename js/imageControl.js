function controlImageInForms() {
    const perfil_btn = document.getElementById('button_perfil')
    if (!perfil_btn.classList.contains('g')) {
        perfil_btn.classList.add('g')
        perfil_btn.querySelector('label').textContent = 'Sim'
    }
}

function generateImageConfirmPage() {
    
}

function controlImage(initialSize = 150, id='imagem_perfil', imgElm = 'imagem_img') {
    const imgField = document.getElementById(id);
    const imgElement = document.getElementById(imgElm);
    imgElement.width = imgElement.height = initialSize;
    imgField.addEventListener('change', (e) => {
        const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgElement.src= e.target.result;
                    controlImageInForms();
                };
                reader.readAsDataURL(file);
            }
    });
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

async function getImageToForm(inputId = 'imagem_perfil_blob', imgId = 'imagem_img') {
    const inputImgBlob = document.getElementById(inputId);
    const img = document.getElementById(imgId);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    document.querySelector('.perfil').appendChild(canvas)

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    document.body.appendChild(canvas)
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

    //Let blob live
    try {
        const img_blob = await getCanvasBlob();
        const imgBase64 = await getBase64FromBlob(img_blob);
        inputImgBlob.value = imgBase64;
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
    }
}