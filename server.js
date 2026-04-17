const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const DB_PATH = path.join(__dirname, 'datos_personal.json');

// RUTA DE PRUEBA RÁPIDA
app.get('/test', (req, res) => {
    res.send("EL SERVIDOR ESTÁ LEYENDO ESTE ARCHIVO CORRECTAMENTE");
});

// RUTA DE AUDITORÍA
app.get('/buscar_todos', (req, res) => {
    if (!fs.existsSync(DB_PATH)) return res.json([]);
    const data = fs.readFileSync(DB_PATH, 'utf8');
    res.json(JSON.parse(data || "[]"));
});

// RUTA DE BÚSQUEDA
app.get('/buscar', (req, res) => {
    if (!fs.existsSync(DB_PATH)) return res.json(null);
    const registros = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || "[]");
    const encontrado = registros.find(r => r.economico === req.query.eco);
    res.json(encontrado || null);
});

// RUTA DE GUARDADO
app.post('/guardar', (req, res) => {
    let registros = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || "[]") : [];
    const index = registros.findIndex(r => r.economico === req.body.economico);
    if (index !== -1) registros[index] = req.body;
    else registros.push(req.body);
    fs.writeFileSync(DB_PATH, JSON.stringify(registros, null, 2));
    res.send("OK");
});

app.listen(PORT, () => {
    console.log("=========================================");
    console.log("   SERVIDOR REINICIADO Y ACTUALIZADO     ");
    console.log("=========================================");
});