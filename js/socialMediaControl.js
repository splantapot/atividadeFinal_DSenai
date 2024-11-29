function controlSocialMediaInForms(id = "redes-lista") {
    const social_media_btn = document.getElementById('button_social_media');
    const lista = document.getElementById(id);

    if (lista.querySelectorAll('div').length > 0) {
        if (!social_media_btn.classList.contains('g')) {
            social_media_btn.classList.add('g')
        }
    } else {
        social_media_btn.classList.remove('g')
    }
    social_media_btn.querySelector('label').textContent = lista.querySelectorAll('div').length;
}

function controlSocialMedia(id = "redes-lista") {
    const lista = document.getElementById(id);
    const text = lista.querySelector('label');

    if (lista.querySelectorAll('div').length > 0 && text) {
        text.remove()
    } else if (lista.querySelectorAll('div').length <= 0) {
        const newText = document.createElement('label');
        newText.textContent = "Você não possui redes sociais";
        lista.prepend(newText)
    }

    controlSocialMediaInForms()
}

function rmvSocialMedia(id = 0) {
    document.getElementById(`rs-id-${id}`).remove();
    controlSocialMedia();
}

function addSocialMedia(id = "redes-lista") {
    const lista = document.getElementById(id);
    const inputList = lista.querySelectorAll('div');

    const iId = inputList.length;
    const newInfo = document.createElement('div');
    newInfo.id = `rs-id-${iId}`;
    newInfo.className = 'rede-social-info';
    newInfo.innerHTML = `
        <input name="rs-name-${iId}" placeholder="Rede Social" list="redes-datalist">
        <input name="rs-perfil-${iId}" placeholder="Perfil de Usuário">
        <input type="button" value="Remover">
    `
    newInfo.querySelector('input[type="button"]').addEventListener('click', () => rmvSocialMedia(iId));

    lista.appendChild(newInfo);

    controlSocialMedia()
}

function validateSocialMedia(id = "redes-lista") {
    const lista = document.getElementById(id);
    const inputList = lista.querySelectorAll('div');
    let canBack = true;

    for (const div of inputList) {
        for (const input of div.querySelectorAll('input')) {
            if (input.value == '') {
                canBack = false;
                break;
            }
        }
        if (!canBack) {
            break;
        }
    }

    if (canBack) {
        navigateFromTo('redes-div','form-cadastro')
    } else {
        alert('Preencha todos os campos exibidos.')
    }
}