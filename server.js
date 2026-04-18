const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuración para soportar fotos (50MB)
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname)); 

// Conexión a tu base de datos en la nube
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error:", err));

// Esquema de datos (Aseguramos que coincida con tus campos)
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
    foto: String
});

const Operador = mongoose.model('Operador', OperadorSchema);

// RUTAS (Manteniendo los nombres originales que tenías en local)
app.get('/buscar', async (req, res) => {
    try {
        const { eco } = req.query;
        const operador = await Operador.findOne({ economico: eco });
        if (operador) res.json(operador);
        else res.json({ error: "No encontrado" });
    } catch (err) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

app.post('/guardar', async (req, res) => {
    try {
        const { economico } = req.body;
        await Operador.findOneAndUpdate({ economico: economico }, req.body, { upsert: true });
        res.json({ status: "OK" });
    } catch (err) {
        res.status(500).json({ error: "Error al guardar" });
    }
});

app.get('/buscar_todos', async (req, res) => {
    const operadores = await Operador.find();
    res.json(operadores);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'índice.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));
