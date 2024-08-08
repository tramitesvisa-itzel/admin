import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2YHOPydtFOFn5Sr3PXNp6H-6TM0p3Urc",
    authDomain: "tramitesvisa-itzel.firebaseapp.com",
    projectId: "tramitesvisa-itzel",
    storageBucket: "tramitesvisa-itzel.appspot.com",
    messagingSenderId: "356859229057",
    appId: "1:356859229057:web:ab3b905aaacfa2d2b86e80"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cargar datos y llenar tabla y select
const loadData = async () => {
    const querySnapshot = await getDocs(collection(db, "datos-formulario"));
    const tableBody = document.querySelector("#dataTable tbody");
    const tipoSolicitudSelect = document.getElementById('tipoSolicitudFilter');
    const tiposSolicitud = new Set();

    tableBody.innerHTML = "";
    tiposSolicitud.add(""); // Opción "Todos"

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tiposSolicitud.add(data.tipo_solicitud);

        const row = document.createElement("tr");
        row.dataset.id = doc.id; // Añadir data-id para la fila
        row.innerHTML = `
            <td>${data.tipo_solicitud}</td>
            <td>${data.numero_telefonico}</td>
            <td>${data.correo_electronico}</td>
            <td><button onclick="showDetails('${doc.id}')">Ver Detalles</button></td>
        `;
        tableBody.appendChild(row);
    });

    tipoSolicitudSelect.innerHTML = ""; // Limpiar select
    tiposSolicitud.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo || "Todos";
        tipoSolicitudSelect.appendChild(option);
    });

    // Configura los filtros
    document.getElementById('numeroTelefonicoFilter').addEventListener('input', filterData);
    document.getElementById('correoElectronicoFilter').addEventListener('input', filterData);
    tipoSolicitudSelect.addEventListener('change', filterData);
};

const filterData = () => {
    const tipoSolicitudFilter = document.getElementById('tipoSolicitudFilter').value.toLowerCase();
    const numeroTelefonicoFilter = document.getElementById('numeroTelefonicoFilter').value.toLowerCase();
    const correoElectronicoFilter = document.getElementById('correoElectronicoFilter').value.toLowerCase();
    const tableRows = document.querySelectorAll('#dataTable tbody tr');

    tableRows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const tipoSolicitud = cells[0].textContent.toLowerCase();
        const numeroTelefonico = cells[1].textContent.toLowerCase();
        const correoElectronico = cells[2].textContent.toLowerCase();
        const match = (tipoSolicitudFilter === "" || tipoSolicitud.includes(tipoSolicitudFilter)) &&
                      numeroTelefonico.includes(numeroTelefonicoFilter) &&
                      correoElectronico.includes(correoElectronicoFilter);
        row.style.display = match ? '' : 'none';
    });
};

window.showDetails = async (id) => {
    const docRef = doc(db, "datos-formulario", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const form = document.getElementById('detailsForm');
        form.innerHTML = `
            <label>Tipo de Solicitud:</label><input type="text" value="${data.tipo_solicitud}" disabled><br>
            <label>Número Telefónico:</label><input type="text" value="${data.numero_telefonico}" disabled><br>
            <label>Correo Electrónico:</label><input type="email" value="${data.correo_electronico}" disabled><br>
            <label>Fecha Última Visita a USA:</label><input type="date" value="${data.fecha_ultimavisit_USA}" disabled><br>
            <label>Duración en USA:</label><input type="text" value="${data.duracionEnUSA}" disabled><br>
            <label>Cantidad de Días o Meses:</label><input type="number" value="${data.cantidad_dias_meses}" disabled><br>
            <label>Apellido Paterno:</label><input type="text" value="${data.apellido_paterno}" disabled><br>
            <label>Apellido Materno:</label><input type="text" value="${data.apellido_materno}" disabled><br>
            <label>Nombres:</label><input type="text" value="${data.nombres}" disabled><br>
            <label>Fecha de Nacimiento:</label><input type="date" value="${data.fecha_nacimiento}" disabled><br>
            <label>Sexo:</label><input type="text" value="${data.sexo}" disabled><br>
            <label>Lugar de Nacimiento:</label><textarea disabled>${data.lugar_nacimiento}</textarea><br>
            <label>Estado Civil:</label><input type="text" value="${data.estado_civil}" disabled><br>
            <label>Nombre Completo del Cónyuge:</label><input type="text" value="${data.nombre_completo_conyuge}" disabled><br>
            <label>Fecha de Nacimiento del Cónyuge:</label><input type="date" value="${data.fecha_nacimiento_conyuge}" disabled><br>
            <label>Lugar de Nacimiento del Cónyuge:</label><textarea disabled>${data.lugar_nacimiento_conyuge}</textarea><br>
            <label>Nombre de Escuela:</label><input type="text" value="${data.nombre_escuela}" disabled><br>
            <label>Dirección de Escuela:</label><textarea disabled>${data.direccion_escuela}</textarea><br>
            <label>Fecha Inicio Escuela:</label><input type="date" value="${data.fecha_inicio_escuela}" disabled><br>
            <label>Fecha Final Escuela:</label><input type="date" value="${data.fecha_final_escuela}" disabled><br>
            <label>Ocupación Actual:</label><input type="text" value="${data.ocupacion_actual}" disabled><br>
            <label>Nombre de Empresa Actual:</label><input type="text" value="${data.nombre_empresa_actual}" disabled><br>
            <label>Domicilio de Empresa Actual:</label><textarea disabled>${data.domicilio_empresas_actual}</textarea><br>
            <label>Fecha Inicio Empleo Actual:</label><input type="date" value="${data.fecha_inicio_empleo_actual}" disabled><br>
            <label>Teléfono Empresa Actual:</label><input type="text" value="${data.telefono_empres_actual}" disabled><br>
            <label>Empleos Anteriores:</label><textarea disabled>${data.empleos_anteriores}</textarea><br>
            <label>Nombres del Papá:</label><input type="text" value="${data.nombres_papa}" disabled><br>
            <label>Fecha de Nacimiento del Papá:</label><input type="date" value="${data.fecha_nacimiento_papa}" disabled><br>
            <label>Teléfono del Papá:</label><input type="text" value="${data.telefono_papa}" disabled><br>
            <label>Domicilio del Papá:</label><textarea disabled>${data.domicilio_papa}</textarea><br>
            <label>Nombres de la Mamá:</label><input type="text" value="${data.nombres_mama}" disabled><br>
            <label>Fecha de Nacimiento de la Mamá:</label><input type="date" value="${data.fecha_nacimiento_mama}" disabled><br>
            <label>Teléfono de la Mamá:</label><input type="text" value="${data.telefono_mama}" disabled><br>
            <label>Domicilio de la Mamá:</label><textarea disabled>${data.domicilio_mama}</textarea><br>
        `;
        document.getElementById('details').style.display = 'block';
        document.querySelector('.table-section').style.display = 'none';
        document.querySelector('.filter-section').style.display = 'none';

        document.getElementById('backButton').onclick = () => {
            document.getElementById('details').style.display = 'none';
            document.querySelector('.table-section').style.display = 'block';
            document.querySelector('.filter-section').style.display = 'block';
        };

        document.getElementById('deleteButton').onclick = async () => {
            if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
                await deleteDoc(docRef);
                alert("Registro eliminado exitosamente");
                loadData();
                document.getElementById('details').style.display = 'none';
                document.querySelector('.table-section').style.display = 'block';
                document.querySelector('.filter-section').style.display = 'block';
            }
        };

        document.getElementById('downloadButton').onclick = () => {
            const formData = new FormData(form);
            const dataObj = {};
            formData.forEach((value, key) => {
                dataObj[key] = value;
            });
            const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.nombres}_${data.apellido_paterno}.json`;
            a.click();
        };
    } else {
        console.log("No se encontró el documento");
    }
};

// Inicializa la carga de datos
document.addEventListener("DOMContentLoaded", loadData);
