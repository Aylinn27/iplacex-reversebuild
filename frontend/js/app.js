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

document.addEventListener('DOMContentLoaded', () => {
    const id = getServiceId();

    if (!id) {
        alert('No hay servicio activo. Vuelve al panel y crea uno desde "Nuevo Servicio".');
        window.location.href = 'dashboard.html';
        return;
    }

    const lbl = document.getElementById('serviceIdLabel');
    if (lbl) lbl.textContent = id;
});

async function agregarPaso() {
    const id = getServiceId();
    if (!id) {
        alert('No hay servicio activo');
        return;
    }

    const desc = document.getElementById('descPaso').value.trim();
    const fileInput = document.getElementById('fotoPaso');

    if (!desc) {
        alert('Debe escribir una descripción');
        return;
    }

    let imgBase64 = '';
    if (fileInput.files.length > 0) {
        imgBase64 = await convertToBase64(fileInput.files[0]);
    }

    const res = await fetch(`${API_URL}/${id}/pasos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desc, img: imgBase64 })
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('[agregarPaso] Error:', err);
        alert('Error al guardar el paso');
        return;
    }

    alert('Paso guardado con éxito ✅');
    document.getElementById('descPaso').value = '';
    fileInput.value = '';
}

async function activarRearme() {
    const id = getServiceId();
    if (!id) {
        alert('No hay servicio activo');
        return;
    }

    const res = await fetch(`${API_URL}/${id}/rearme`);
    if (!res.ok) {
        const err = await res.text();
        console.error('[activarRearme] Error:', err);
        alert('No se pudo obtener la guía de rearme');
        return;
    }

    const data = await res.json();
    const lista = document.getElementById('listaPasos');
    lista.innerHTML = '<h3>⬇️ GUÍA DE REARME (INVERSA) ⬇️</h3>';

    if (!data.pasos || data.pasos.length === 0) {
        lista.innerHTML += '<p>No hay pasos registrados.</p>';
        return;
    }

    data.pasos.forEach(paso => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p><strong>Paso ${paso.ord}:</strong> ${paso.desc}</p>
            ${paso.img ? `<img src="${paso.img}" class="preview">` : ''}
        `;
        lista.appendChild(card);
    });
}

async function finalizarServicio() {
    const id = getServiceId();
    if (!id) {
        alert('No hay servicio activo');
        return;
    }

    const res = await fetch(`${API_URL}/${id}/finalizar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('[finalizarServicio] Error:', err);
        alert('No se pudo finalizar el servicio');
        return;
    }

    alert('Servicio finalizado 🚀');
    localStorage.removeItem('serviceId');
    window.location.href = 'dashboard.html';
}
