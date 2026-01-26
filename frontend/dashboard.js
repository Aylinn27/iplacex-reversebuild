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
            throw new Error('No se pudo obtener el rearme');
        }

        const data = await res.json();
        const lista = document.getElementById('listaPasos');
        lista.innerHTML = '';

        data.pasos.forEach(paso => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Paso ${paso.ord}:</strong> ${paso.desc}
                ${paso.img ? `<br><img src="${paso.img}" width="200">` : ''}
            `;
            lista.appendChild(li);
        });

    } catch (error) {
        alert('Error al generar la guía de rearme');
        console.error(error);
    }
}
