const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuraciones (Aumentamos el límite para que soporten las FOTOS)
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname)); 

// Tu conexión a MongoDB Atlas
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema completo con todos tus campos del Sistema Herradura
const OperadorSchema = new mongoose.Schema({
    nombre: String,
    economico: String,
    telefono: String,
    domicilio: String,
    venc_licencia: String,
    venc_seguro: String,
    contacto: String,
    telefono_emergencia: String,
    licencia: String,
    seguro: String,
    b1_n: String, b1_p: String,
    b2_n: String, b2_p: String,
    b3_n: String, b3_p: String,
    b4_n: String, b4_p: String,
    foto: String // Aquí se guarda la imagen en base64
});

const Operador = mongoose.model('Operador', OperadorSchema);

// --- RUTAS DEL SERVIDOR ---

// 1. Cargar la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'índice.html'));
});

// 2. Guardar o Actualizar un operador (Alta/Editar)
app.post('/api/operadores', async (req, res) => {
    try {
        const { economico } = req.body;
        // Si ya existe el económico, lo actualiza. Si no, lo crea.
        const resultado = await Operador.findOneAndUpdate(
            { economico: economico }, 
            req.body, 
            { upsert: true, new: true }
        );
        res.json({ status: "OK", data: resultado });
    } catch (err) {
        res.status(500).json({ error: "Error al guardar en base de datos" });
    }
});

// 3. Buscar un operador por Económico o Nombre
app.get('/api/operadores/buscar', async (req, res) => {
    try {
        const { eco, nom } = req.query;
        let busqueda = {};
        
        if (eco) busqueda = { economico: eco };
        else if (nom) busqueda = { nombre: new RegExp(nom, 'i') }; // Busca coincidencias de nombre

        const operador = await Operador.findOne(busqueda);
        if (operador) res.json(operador);
        else res.json({ error: "No encontrado" });
    } catch (err) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});

// 4. Obtener todos (Para el panel de Auditoría)
app.get('/api/operadores', async (req, res) => {
    try {
        const operadores = await Operador.find();
        res.json(operadores);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener lista" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Herradura listo en puerto ${PORT}`);
});
