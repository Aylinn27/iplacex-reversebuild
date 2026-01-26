const API_URL = '/api/services';
let currentServiceId = 'ID_DEL_SERVICIO_CREADO_MANUALMENTE_PARA_TEST'; 
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

async function agregarPaso() {
    const desc = document.getElementById('descPaso').value;
    const fileInput = document.getElementById('fotoPaso');
    let imgBase64 = '';

    if (fileInput.files.length > 0) {
        imgBase64 = await convertToBase64(fileInput.files[0]);
    }

    const response = await fetch(`${API_URL}/${currentServiceId}/pasos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desc, img: imgBase64 })
    });

    if (response.ok) {
        alert('Paso guardado con foto ✅');
        location.reload(); 
    }
}

async function activarRearme() {
    const response = await fetch(`${API_URL}/${currentServiceId}/rearme`);
    const data = await response.json();
    
    const lista = document.getElementById('listaPasos');
    lista.innerHTML = '<h3>⬇️ GUÍA DE REARME (INVERSA) ⬇️</h3>';
    
    data.pasos.forEach(paso => {
        lista.innerHTML += `
            <div class="card">
                <p><strong>Orden: ${paso.ord}</strong></p>
                <p>${paso.desc}</p>
                ${paso.img ? `<img src="${paso.img}" class="preview">` : ''}
                <input type="checkbox"> Completado
            </div>
        `;
    });
    
    document.getElementById('formDesarme').style.display = 'none';
}
