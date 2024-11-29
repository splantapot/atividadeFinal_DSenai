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