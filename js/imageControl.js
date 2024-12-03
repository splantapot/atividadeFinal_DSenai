function promptImage(file, minSize = 150, maxSize = 300) {
    const prompt = document.querySelector('.image-prompt');
    prompt.show = function () { prompt.classList.remove('hidden'); };
    prompt.hide = function () { prompt.classList.add('hidden'); };

    const canvas = document.querySelector(".cropper-container canvas");
    const ctx = canvas.getContext("2d");

    let img = new Image();
    let cropping = false;
    let resizing = false;  // Flag para o redimensionamento
    let cropBox = { x: 0, y: 0, width: 150, height: 150 }; // Área inicial de recorte
    let dragStart = null;
    let resizeStart = null; // Para controlar o redimensionamento

    prompt.show();

    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                img.onload = function () {
                    // Ajusta a imagem para caber no canvas com maxSize respeitando a proporção
                    const aspectRatio = img.width / img.height;

                    let newWidth = img.width;
                    let newHeight = img.height;

                    // Redimensionar para ajustar o maior lado a maxSize
                    if (newWidth > newHeight) {
                        if (newWidth > maxSize) {
                            newWidth = maxSize;
                            newHeight = newWidth / aspectRatio;
                        } else if (newWidth < minSize) {
                            newHeight = minSize;
                            newWidth = newHeight * aspectRatio;
                        }
                    } else {
                        if (newHeight > maxSize) {
                            newHeight = maxSize;
                            newWidth = newHeight * aspectRatio;
                        } else if (newHeight < minSize) {
                            newWidth = minSize;
                            newHeight = newWidth / aspectRatio;
                        }
                    }

                    // Ajusta o tamanho do canvas para a imagem redimensionada
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Desenha a imagem redimensionada no canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Desenha o retângulo de recorte no canvas
                    drawCropBox();
                };

                img.src = e.target.result; // Define a imagem como origem
            };

            reader.readAsDataURL(file);

            // Funções para lidar com eventos de toque e mouse
            function getMousePosition(e) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
                const mouseY = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
                return { x: mouseX, y: mouseY };
            }

            // Eventos do Canvas para interatividade (com suporte a toque)
            canvas.addEventListener("mousedown", (e) => {
                const { x: mouseX, y: mouseY } = getMousePosition(e);

                // Verificar se o clique foi dentro do retângulo de recorte (para mover)
                if (
                    mouseX >= cropBox.x &&
                    mouseX <= cropBox.x + cropBox.width &&
                    mouseY >= cropBox.y &&
                    mouseY <= cropBox.y + cropBox.height
                ) {
                    cropping = true;
                    dragStart = { x: mouseX, y: mouseY };
                }
            });

            // Adicionando suporte ao toque
            canvas.addEventListener("touchstart", (e) => {
                e.preventDefault();
                const { x: mouseX, y: mouseY } = getMousePosition(e);

                // Verificar se o toque foi dentro do retângulo de recorte (para mover)
                if (
                    mouseX >= cropBox.x &&
                    mouseX <= cropBox.x + cropBox.width &&
                    mouseY >= cropBox.y &&
                    mouseY <= cropBox.y + cropBox.height
                ) {
                    cropping = true;
                    dragStart = { x: mouseX, y: mouseY };
                }
            });

            canvas.addEventListener("mousemove", (e) => {
                if (cropping) {
                    const { x: mouseX, y: mouseY } = getMousePosition(e);

                    const dx = mouseX - dragStart.x;
                    const dy = mouseY - dragStart.y;

                    cropBox.x = Math.max(0, Math.min(cropBox.x + dx, canvas.width - cropBox.width));
                    cropBox.y = Math.max(0, Math.min(cropBox.y + dy, canvas.height - cropBox.height));

                    dragStart = { x: mouseX, y: mouseY };
                    redrawCanvas();
                }

                if (resizing) {
                    const { x: mouseX, y: mouseY } = getMousePosition(e);

                    const dx = mouseX - resizeStart.x;
                    const dy = mouseY - resizeStart.y;

                    // Ajuste no tamanho do retângulo de recorte
                    cropBox.width = Math.max(50, cropBox.width + dx); // largura mínima 50px
                    cropBox.height = Math.max(50, cropBox.height + dy); // altura mínima 50px

                    resizeStart = { x: mouseX, y: mouseY };
                    redrawCanvas();
                }
            });

            // Adicionando suporte ao toque
            canvas.addEventListener("touchmove", (e) => {
                e.preventDefault();
                if (cropping) {
                    const { x: mouseX, y: mouseY } = getMousePosition(e);

                    const dx = mouseX - dragStart.x;
                    const dy = mouseY - dragStart.y;

                    cropBox.x = Math.max(0, Math.min(cropBox.x + dx, canvas.width - cropBox.width));
                    cropBox.y = Math.max(0, Math.min(cropBox.y + dy, canvas.height - cropBox.height));

                    dragStart = { x: mouseX, y: mouseY };
                    redrawCanvas();
                }

                if (resizing) {
                    const { x: mouseX, y: mouseY } = getMousePosition(e);

                    const dx = mouseX - resizeStart.x;
                    const dy = mouseY - resizeStart.y;

                    // Ajuste no tamanho do retângulo de recorte
                    cropBox.width = Math.max(50, cropBox.width + dx); // largura mínima 50px
                    cropBox.height = Math.max(50, cropBox.height + dy); // altura mínima 50px

                    resizeStart = { x: mouseX, y: mouseY };
                    redrawCanvas();
                }
            });

            // Eventos de fim de interação
            canvas.addEventListener("mouseup", () => {
                cropping = false;
                resizing = false;
            });

            // Adicionando suporte ao toque
            canvas.addEventListener("touchend", () => {
                cropping = false;
                resizing = false;
            });

            canvas.addEventListener("mouseleave", () => {
                cropping = false;
                resizing = false;
            });

            // Confirmar recorte
            prompt.querySelector('.confirm').addEventListener('click', () => {
                const croppedCanvas = document.createElement("canvas");
                const croppedCtx = croppedCanvas.getContext("2d");

                croppedCanvas.width = cropBox.width;
                croppedCanvas.height = cropBox.height;

                redrawCanvas(false);

                croppedCtx.drawImage(
                    canvas,
                    cropBox.x, cropBox.y, cropBox.width, cropBox.height, // Fonte
                    0, 0, cropBox.width, cropBox.height                  // Destino
                );

                prompt.hide();
                resolve(croppedCanvas.toDataURL()); // Retorna o recorte como Base64
            });

            // Cancelar operação
            prompt.querySelector('.cancel').addEventListener('click', () => {
                prompt.hide();
                resolve(null);
            });

            function drawCropBox() {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
            }

            function redrawCanvas(drawCrop = true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                if (drawCrop) drawCropBox();
            }
        } else {
            prompt.hide();
            reject(null);
        }
    });
}

//Show
function renderImageInCanvas(base64Image, id = 'preview-canvas') {
    if (base64Image) {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
    
        // Cria uma nova imagem
        const img = new Image();
    
        // Quando a imagem for carregada, desenha ela no canvas
        img.onload = function() {
            // Define o tamanho do canvas para as dimensões da imagem
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Limpa o canvas e desenha a imagem nele
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    
        // Defina a imagem base64 como a fonte da imagem
        img.src = base64Image;
        canvas.defaultImage = false;
    }
}

//Setup what the system does when input changes his value
function setupImageInput(dataManipulationFunction = renderImageInCanvas, id = "file-picker",  promptFunction = promptImage) {
    const input = document.getElementById(id);
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            input.value = '';
            return await dataManipulationFunction(await promptFunction(file))
        } else {
            return null;
        }

    })
}

//Init preview-canvas
function initPreview(customData = null, id = 'preview-canvas', defaultImageSize = 150) {
    const img = new Image(defaultImageSize, defaultImageSize);
    img.onload = function() {

        // Define o tamanho do canvas para as dimensões da imagem
        canvas.width = img.width;
        canvas.height = img.height;

        // Limpa o canvas e desenha a imagem nele
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    
    if (customData) {
        img.src = customData;
        canvas.defaultImage = false;
    } else {
        img.src = '/images/guest.png';
        canvas.defaultImage = true;
    }

}

//Show "image loaded" in forms
function controlImageInForms(id = 'preview-canvas') {
    const canvas = document.getElementById(id);
    const perfil_btn = document.getElementById('button_perfil');
    if (!canvas.defaultImage) {
        if (!perfil_btn.classList.contains('g')) {
            perfil_btn.classList.add('g')
            perfil_btn.querySelector('label').textContent = 'Sim'
        }
    }
}

//Put the preview img in forms
function getImageToForm(input_id = 'imagem_base64', canvas_id = 'preview-canvas') {
    const canvas = document.getElementById(canvas_id);
    const input = document.getElementById(input_id);
    console.log('here inside func getimg')
    if (canvas && input) {
        const base64Image = canvas.toDataURL();
        input.value = base64Image;
    } else {
        console.error('Canvas ou input não encontrado.');
    }
}