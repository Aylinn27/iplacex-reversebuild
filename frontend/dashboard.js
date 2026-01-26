const API_URL = '/api/services';

async function verRearme() {
    const serviceId = document.getElementById('serviceId').value;
    const token = localStorage.getItem('token');

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${serviceId}/rearme`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(err);
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
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Paso ${paso.ord}:</strong> ${paso.desc}
                ${paso.img ? `<br><img src="${paso.img}" width="200">` : ''}
            `;
            lista.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        alert('Error inesperado al generar la guía');
    }
}
