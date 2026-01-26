const API_URL = '/api/services';

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

