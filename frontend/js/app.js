const API_URL = '/api/services';

function getServiceId() {
    return localStorage.getItem('serviceId');
}

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// Mostrar ID del servicio activo (debug + evidencia)
document.addEventListener('DOMContentLoaded', () => {
    const serviceId = getServiceId();
    const info = document.getElementById('serviceInfo');

    if (!serviceId) {
        alert('No hay servicio activo. Vuelve al dashboard.');
        window.location.href = 'dashboard.html';
        return;
    }

    info.innerText = `Servicio activo ID: ${serviceId}`;
});

async function agregarPaso() {
    const desc = document.getElementById('descPaso').value;
    const fileInput = document.getElementById('fotoPaso');
    const token = localStorage.getItem('token');
    const serviceId = getServiceId();

    if (!desc) {
        alert('Debe escribir una descripción');
        return;
    }

    if (!serviceId) {
        alert('Servicio no válido');
        return;
    }

    let imgBase64 = '';
    if (fileInput.files.length > 0) {
        imgBase64 = await convertToBase64(fileInput.files[0]);
    }

    const response = await fetch(`${API_URL}/${serviceId}/pasos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ desc, img: imgBase64 })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error(err);
        alert('Error al guardar paso');
        return;
    }

    alert('Paso guardado correctamente ✅');
    document.getElementById('descPaso').value = '';
    fileInput.value = '';
}

async function activarRearme() {
    const serviceId = getServiceId();

    const response = await fetch(`${API_URL}/${serviceId}/rearme`);
    const data = await response.json();

    const lista = document.getElementById('listaPasos');
    lista.innerHTML = '<h3>⬇️ GUÍA DE REARME (INVERSA) ⬇️</h3>';

    data.pasos.forEach(paso => {
        lista.innerHTML += `
            <div class="card">
                <p><strong>Paso ${paso.ord}</strong></p>
                <p>${paso.desc}</p>
                ${paso.img ? `<img src="${paso.img}" class="preview">` : ''}
            </div>
        `;
    });

    document.getElementById('formDesarme').style.display = 'none';
}



