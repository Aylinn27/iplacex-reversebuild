const API_URL = '/api/services';

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Dashboard] Cargado');

    const btn = document.getElementById('btnRearme');
    btn.addEventListener('click', verRearme);
});

async function verRearme() {
    const serviceId = document.getElementById('serviceId').value.trim();

    if (!serviceId) {
        alert('Debe ingresar un ID');
        return;
    }

    console.log('[Dashboard] Consultando rearme ID:', serviceId);

    try {
        const res = await fetch(`${API_URL}/${serviceId}/rearme`);

        if (!res.ok) {
            alert('No existe el servicio o no tiene pasos aún');
            console.error('HTTP', res.status);
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
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Paso ${paso.ord}:</strong> ${paso.desc}
                ${paso.img ? `<br><img src="${paso.img}" width="200">` : ''}
            `;
            lista.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        alert('Error inesperado al obtener rearme');
    }
}

