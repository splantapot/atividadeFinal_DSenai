function validatePassword(event) {
    event.preventDefault();
    const form = event.target;
    const senha = form.querySelector('input[name="senha"]').value
    const confirma = form.querySelector('input[name="confirma"]').value
    if (senha != confirma) {
        alert('As senhas não coincidem.')
    } else {
        form.submit();
    }
}

async function validateUserAdd(event) {
    event.preventDefault();
    getImageToForm();
    validatePassword(event);
}