const API_URL = '/api/services';

function getServiceId() {
    return document.getElementById('serviceId').value;
}

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

async function agregarPaso() {
    const desc = document.getElementById('descPaso').value;
    const fileInput = document.getElementById('fotoPaso');
    const token = localStorage.getItem('token');
    let imgBase64 = '';

    if (!getServiceId()) {
        alert('Debe ingresar el ID del servicio');
        return;
    }

    if (fileInput.files.length > 0) {
        imgBase64 = await convertToBase64(fileInput.files[0]);
    }

    const response = await fetch(`${API_URL}/${getServiceId()}/pasos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ desc, img: imgBase64 })
    });

    if (response.ok) {
        alert('Paso guardado con éxito ✅');
        verRearme(); // refresca sin recargar
    } else {
        alert('Error al guardar el paso');
    }
}

