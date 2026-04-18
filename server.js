const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname));

// Conexión a MongoDB Atlas (La que ya tenemos)
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("Conectado a la nube"))
  .catch(err => console.log("Error de conexión:", err));

// Esquema flexible (Aceptará todos los campos de tu app local automáticamente)
const Operador = mongoose.model('Operador', new mongoose.Schema({}, { strict: false }));

// RUTA PARA BUSCAR
app.get('/api/buscar', async (req, res) => {
    try {
        const registro = await Operador.findOne({ economico: req.query.eco });
        if (registro) res.json(registro);
        else res.json({ error: "No encontrado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// RUTA PARA GUARDAR
app.post('/api/guardar', async (req, res) => {
    try {
        await Operador.findOneAndUpdate({ economico: req.body.economico }, req.body, { upsert: true });
        res.json({ status: "OK" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'índice.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en línea"));
