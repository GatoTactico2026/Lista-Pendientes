const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// 1. CORRECCIÓN DE RUTA: Quitamos 'proyectos' porque tu carpeta 'public' está en la raíz
app.use(express.static(path.join(__dirname, 'public')));

let estado = { pendientes: "", realizadas: "" };
let nombres = [];

function sincronizarNombres() {
    nombres = [];
    const regex = /<span>(.*?)<\/span>/g;
    let match;
    
    while ((match = regex.exec(estado.pendientes)) !== null) {
        nombres.push(match[1].toLowerCase().trim()); // .trim() por si hay espacios locos
    }
    
    regex.lastIndex = 0;
    while ((match = regex.exec(estado.realizadas)) !== null) {
        nombres.push(match[1].toLowerCase().trim());
    }
}

// 2. CORRECCIÓN DE RUTA: Aquí también quitamos 'proyectos'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/estado', (req, res) => res.json(estado));

app.post('/api/agregar', (req, res) => {
    const { nombre } = req.body;
    // Validación más robusta
    if (!nombre || nombres.includes(nombre.toLowerCase().trim())) {
        return res.status(400).json({ error: "Nombre inválido o duplicado" });
    }
    
    nombres.push(nombre.toLowerCase().trim());
    res.status(201).send();
});

app.post('/api/guardar', (req, res) => {
    estado = req.body;
    sincronizarNombres();
    res.sendStatus(200);
});

// Usar 3000 o 8080 está bien, pero asegúrate de que no esté ocupado
app.listen(8080, '0.0.0.0', () => { // inicia servidor puerto 8080
    console.log('Servidor corriendo en http://0.0.0.0:8080'); // mensaje inicio
});