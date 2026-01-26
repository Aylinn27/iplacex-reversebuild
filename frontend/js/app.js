// ================================
// CONFIGURACIÓN GENERAL
// ================================
const API_URL = '/api/services';

// Obtiene el ID del servicio desde el input
function getServiceId() {
    return document.getElementById('serviceId').value.trim();
}

// ================================
// CONVERSIÓN IMAGEN A BASE64
// ================================
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// ================================
// AGREGAR PASO (DESARME)
// ================================
async function agregarPaso() {
    const desc = document.getElementById('descPaso').value.trim();
    const fileInput = document.getElementById('fotoPaso');
    const token = localStorage.getItem('token');
    const serviceId = getServiceId();

    // --- VALIDACIONES ---
    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        return;
    }

    if (!desc) {
        alert('Debe escribir una descripción del paso');
        return;
    }

    if (!token) {
        alert('Sesión expirada. Inicie sesión nuevamente.');
        return;
    }

    // --- IMAGEN ---
    let imgBase64 = '';
    if (fileInput.files.length > 0) {
        imgBase64 = await convertToBase64(fileInput.files[0]);
    }

    // --- REQUEST ---
    const response = await fetch(`${API_URL}/${serviceId}/pasos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            desc: desc,
            img: imgBase64
        })
    });

    // --- MANEJO DE ERRORES ---
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error backend:', errorText);
        alert('Error al guardar el paso. Revisa la consola.');
        return;
    }

    alert('Paso guardado correctamente ✅');

    // Limpia formulario
    document.getElementById('descPaso').value = '';
    document.getElementById('fotoPaso').value = '';

    // Actualiza la guía sin recargar
    activarRearme();
}

// ================================
// MOSTRAR GUÍA DE REARME (INVERSA)
// ================================
async function activarRearme() {
    const serviceId = getServiceId();
    const token = localStorage.getItem('token');

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        return;
    }

    if (!token) {
        alert('Sesión expirada. Inicie sesión nuevamente.');
        return;
    }

    const response = await fetch(`${API_URL}/${serviceId}/rearme`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        alert('No se pudo generar la guía de rearme');
        return;
    }

    const data = await response.json();
    const lista = document.getElementById('listaPasos');

    lista.innerHTML = '<h3>⬇️ GUÍA DE REARME (INVERSA) ⬇️</h3>';

    data.pasos.forEach(paso => {
        lista.innerHTML += `
            <div class="card">
                <p><strong>Paso ${paso.ord}</strong></p>
                <p>${paso.desc}</p>
                ${paso.img ? `<img src="${paso.img}" class="preview">` : ''}
                <label>
                    <input type="checkbox"> Completado
                </label>
            </div>
        `;
    });
}


