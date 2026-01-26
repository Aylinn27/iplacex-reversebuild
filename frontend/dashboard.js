const API_URL = '/api/services';

async function verRearme() {
    const serviceIdInput = document.getElementById('serviceId');
    const serviceId = serviceIdInput.value.trim();

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        serviceIdInput.focus();
        return;
    }

    console.log('[Dashboard] Buscando rearme para ID:', serviceId);

    try {
        // 👉 Igual que en service.html: SIN token, solo GET simple
        const res = await fetch(`${API_URL}/${serviceId}/rearme`);

        if (!res.ok) {
            const errText = await res.text();
            console.error('[Dashboard] Error HTTP:', res.status, errText);
            alert('No se pudo obtener la guía de rearme (revise consola del navegador).');
            return;
        }

        const data = await res.json();
        console.log('[Dashboard] Datos recibidos:', data);

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
        alert('Error inesperado al generar la guía (ver consola).');
    }
}

