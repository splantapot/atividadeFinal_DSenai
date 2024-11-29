function controlImage(id='imagem_perfil', imgElm =  'imagem_IMG') {
    const imgField = document.getElementById(id);
    const imgElement = document.getElementById(imgElm);
    imgField.addEventListener('change', (e) => {
        const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgElement.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
    });
}

function controlImageInForms() {
    const defaultImage = "/images/guest.png"
    if (imgElement.src != defaultImage) {
        
    }
}