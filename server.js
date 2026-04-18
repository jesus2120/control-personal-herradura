const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuraciones necesarias
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); 

// Tu llave de conexión a MongoDB Atlas
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema para el Control de Personal
const OperadorSchema = new mongoose.Schema({
    nombre: String,
    gafete: String,
    vencimiento: String,
    beneficiario: String,
    parentesco: String
});

const Operador = mongoose.model('Operador', OperadorSchema);

// --- RUTAS DEL SISTEMA ---

// 1. Cargar la página principal (Tu diseño elegante)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'índice.html'));
});

// 2. Obtener la lista de operadores de la nube
app.get('/api/operadores', async (req, res) => {
    try {
        const operadores = await Operador.find();
        res.json(operadores);
    } catch (err) {
        res.status(500).send("Error al obtener datos");
    }
});

// 3. Guardar un nuevo operador en la nube
app.post('/api/operadores', async (req, res) => {
    try {
        const nuevo = new Operador(req.body);
        await nuevo.save();
        res.json({ status: "Operador guardado con éxito" });
    } catch (err) {
        res.status(500).send("Error al guardar");
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
