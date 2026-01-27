const API_URL = '/api/services';

async function crearServicio() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Sesión expirada');
        window.location.href = 'index.html';
        return;
    }


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
        console.log('[Dashboard] Servicio creado:', data);


        localStorage.setItem('serviceId', data._id);


        window.location.href = `service.html?id=${data._id}`;

    } catch (error) {
        console.error('[Dashboard] Error de conexión:', error);
        alert('Error de conexión con el servidor');
    }
}

async function verRearme() {
    const input = document.getElementById('serviceId');
    let serviceId = input.value.trim();

    if (!serviceId) {
        const lastId = localStorage.getItem('serviceId');
        if (lastId) {
            serviceId = lastId;
            input.value = lastId;
        }
    }

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        input.focus();
        return;
    }

    console.log('[Dashboard] Buscando rearme para ID:', serviceId);

    try {
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
        lista.innerHTML = '<h3>📘 GUÍA DE REARME (INVERSA)</h3>';

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


document.addEventListener('DOMContentLoaded', () => {
    const lastId = localStorage.getItem('serviceId');
    const input = document.getElementById('serviceId');
    if (input && lastId) {
        input.value = lastId;
    }
});
