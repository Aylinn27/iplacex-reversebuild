const API_URL = '/api/services';

let ultimaGuia = null; 

function getServiceId() {
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');

  if (idFromUrl) {
    localStorage.setItem('serviceId', idFromUrl);
    return idFromUrl;
  }

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

async function agregarPaso() {
  const serviceId = getServiceId();
  if (!serviceId) {
    alert('No hay servicio activo. Vuelve al panel y crea uno desde "Nuevo Servicio".');
    window.location.href = 'dashboard.html';
    return;
  }

  const desc = document.getElementById('descPaso').value.trim();
  const fileInput = document.getElementById('fotoPaso');
  let imgBase64 = '';

  if (!desc) {
    alert('Debe escribir una descripción para el paso.');
    return;
  }

  if (fileInput.files.length > 0) {
    imgBase64 = await convertToBase64(fileInput.files[0]);
  }

  try {
    const response = await fetch(`${API_URL}/${serviceId}/pasos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc, img: imgBase64 })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Service] Error al guardar paso:', err);
      alert('Error al guardar el paso (ver consola).');
      return;
    }

    alert('Paso guardado con éxito ✅');

    document.getElementById('descPaso').value = '';
    fileInput.value = '';

  } catch (error) {
    console.error('[Service] Error de conexión al guardar paso:', error);
    alert('Error de conexión con el servidor.');
  }
}

async function activarRearme() {
  const serviceId = getServiceId();
  if (!serviceId) {
    alert('No hay servicio activo. Vuelve al panel y crea uno desde "Nuevo Servicio".');
    window.location.href = 'dashboard.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${serviceId}/rearme`);

    if (!response.ok) {
      const err = await response.text();
      console.error('[Service] Error al obtener rearme:', err);
      alert('No se pudo obtener la guía de rearme.');
      return;
    }

    const data = await response.json();
    ultimaGuia = data; 

    const lista = document.getElementById('listaPasos');
    lista.innerHTML = '<h3>📘 GUÍA DE REARME (INVERSA)</h3>';

    if (!data.pasos || data.pasos.length === 0) {
      lista.innerHTML += '<p>No hay pasos registrados aún.</p>';
      return;
    }

    data.pasos.forEach(paso => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginTop = '10px';
      card.innerHTML = `
        <p><strong>Paso ${paso.ord}</strong></p>
        <p>${paso.desc}</p>
        ${paso.img ? `<img src="${paso.img}" class="preview">` : ''}
      `;
      lista.appendChild(card);
    });

  } catch (error) {
    console.error('[Service] Error de conexión al cargar rearme:', error);
    alert('Error inesperado al obtener la guía de rearme.');
  }
}

async function finalizarServicio() {
  const serviceId = getServiceId();
  if (!serviceId) {
    alert('No hay servicio activo. Vuelve al panel y crea uno desde "Nuevo Servicio".');
    window.location.href = 'dashboard.html';
    return;
  }

  if (!confirm('¿Seguro que deseas finalizar este servicio?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${serviceId}/finalizar`, {
      method: 'PUT'
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Service] Error al finalizar servicio:', err);
      alert('No se pudo finalizar el servicio.');
      return;
    }

    alert('Servicio finalizado correctamente ✅');

    localStorage.removeItem('serviceId');

    window.location.href = 'dashboard.html';

  } catch (error) {
    console.error('[Service] Error de conexión al finalizar servicio:', error);
    alert('Error de conexión con el servidor.');
  }
}

async function exportarPDF() {
  const serviceId = getServiceId();

  // Debe existir una guía cargada (activarRearme)
  if (!ultimaGuia || !ultimaGuia.pasos || ultimaGuia.pasos.length === 0) {
    alert('Primero debes generar la guía de rearme (botón "Iniciar Rearme").');
    return;
  }


  let JsPDFConstructor = null;

  if (window.jspdf && window.jspdf.jsPDF) {

    JsPDFConstructor = window.jspdf.jsPDF;
  } else if (window.jsPDF) {

    JsPDFConstructor = window.jsPDF;
  } else {
    alert('No se encontró la librería jsPDF. Verifica el <script> en service.html.');
    return;
  }

  const doc = new JsPDFConstructor();

  let y = 20;

  doc.setFontSize(14);
  doc.text('Guía de Rearme (Inversa)', 10, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(`ID Servicio: ${serviceId || ''}`, 10, y);
  y += 8;

  ultimaGuia.pasos.forEach((paso) => {
    const texto = `Paso ${paso.ord}: ${paso.desc}`;
    const lines = doc.splitTextToSize(texto, 180);

    if (y + lines.length * 6 > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, 10, y);
    y += lines.length * 6 + 4;
  });

  doc.save(`rearme_${serviceId || 'servicio'}.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getServiceId();

  if (!id) {
    alert('No hay servicio activo. Vuelve al panel y crea uno desde "Nuevo Servicio".');
    window.location.href = 'dashboard.html';
    return;
  }

  const label = document.getElementById('serviceIdLabel');
  if (label) {
    label.textContent = id;
  }
});

