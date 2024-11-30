function notification(errList = {}, successList = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    const error = (urlParams.get('e'));
    const success = (urlParams.get('s'));
    if (errList[error]) {
        alert(errList[error])
    }
    if (successList[success]) {
        alert(successList[success])
    }
}

notification();