const API_URL = '/api/services';

// ✅ ESTA es tu función que ya funciona: NO LA TOCAMOS
async function crearServicio() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Sesión expirada');
        window.location.href = 'index.html';
        return;
    }

    // Datos iniciales (pueden venir de un formulario después)
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
            console.error(err);
            alert('Error al crear el servicio');
            return;
        }

        const data = await response.json();

        // ✅ CLAVE PARA QUE FUNCIONE TODO
        localStorage.setItem('serviceId', data._id);

        // 👉 Ahora sí
        window.location.href = 'service.html';

    } catch (error) {
        console.error(error);
        alert('Error de conexión con el servidor');
    }
}

// ✅ NUEVA FUNCIÓN: ver guía de rearme por ID escrito en el dashboard
async function verRearme() {
    const input = document.getElementById('serviceId');
    const serviceId = input.value.trim();

    if (!serviceId) {
        alert('Debe ingresar el ID del servicio');
        input.focus();
        return;
    }

    console.log('[Dashboard] Consultando rearme para ID:', serviceId);

    try {
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
