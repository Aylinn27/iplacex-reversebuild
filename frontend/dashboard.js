const API_URL = '/api/services';

async function crearServicio() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Sesión expirada');
        window.location.href = 'index.html';
        return;
    }

    // Datos demo (más adelante podrías pedirlos por formulario)
    const cliente = {
        rut: '12.345.678-9',
        nombre: 'Empresa Demo'
    };

    const equipo = {
        tipo: 'Notebook',
        sn: 'NB-REV-001'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cliente, equipo })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('[Dashboard] Error al crear servicio:', err);
            alert('Error al crear el servicio');
            return;
        }

        const data = await response.json();

        // 🔑 Guardamos el ID para usarlo en service.html
        localStorage.setItem('serviceId', data._id);

        // Ir a la pantalla de desarme
        window.location.href = 'service.html';

    } catch (error) {
        console.error('[Dashboard] Error de conexión:', error);
        alert('Error de conexión con el servidor');
    }
}

/**
 * Ver guía de rearme desde un ID ingresado en el dashboard
 */
async function verRearme() {
    const serviceIdInput = document.getElementById('serviceId');
    const serviceId = serviceIdInput.value.trim();

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        serviceIdInput.focus();
        return;
    }

    console.log('[Dashboard] Consultando rearme para ID:', serviceId);

    try {
        // Igual que en service.html: GET simple
        const res = await fetch(`${API_URL}/${serviceId}/rearme`);

        if (!res.ok) {
            const errText = await res.text();
            console.error('[Dashboard] Error HTTP:', res.status, errText);
            alert('No se pudo obtener la guía de rearme. Revise que el ID exista.');
            return;
        }

        const data = await res.json();
        console.log('[Dashboard] Datos rearme:', data);

        const lista = document.getElementById('listaPasos');
        lista.innerHTML = '<h3>⬇️ GUÍA DE REARME (INVERSA) ⬇️</h3>';

        if (!data.pasos || data.pasos.length === 0) {
            lista.innerHTML += '<p>No hay pasos registrados para este servicio.</p>';
            return;
        }

        data.pasos.forEach(paso => {
            const li = document.createElement('li');
            li.style.marginBottom = '10px';
            li.innerHTML = `
                <strong>Paso ${paso.ord}:</strong> ${paso.desc}
                ${paso.img ? `<br><img src="${paso.img}" width="200">` : ''}
            `;
            lista.appendChild(li);
        });

    } catch (error) {
        console.error('[Dashboard] Error inesperado:', error);
        alert('Error inesperado al generar la guía. Revise la consola.');
    }
}

// Cuando cargue el dashboard, enganchar el botón de rearme
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnRearme');
    if (btn) {
        btn.addEventListener('click', verRearme);
    }
});
