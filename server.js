const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname));

// CONEXIÓN
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";
mongoose.connect(mongoURI);

// MODELO ABIERTO (Para que acepte tus datos tal cual vienen de tu local)
const Operador = mongoose.model('Operador', new mongoose.Schema({}, { strict: false }));

// RUTA DE BÚSQUEDA
app.get('/buscar', async (req, res) => {
    const registro = await Operador.findOne({ economico: req.query.eco });
    res.json(registro || { error: "No encontrado" });
});

// RUTA DE GUARDADO
app.post('/guardar', async (req, res) => {
    try {
        await Operador.findOneAndUpdate({ economico: req.body.economico }, req.body, { upsert: true });
        res.json({ status: "OK" });
    } catch (e) { res.status(500).send(e); }
});

// RUTA PARA AUDITORÍA
app.get('/buscar_todos', async (req, res) => {
    const todos = await Operador.find();
    res.json(todos);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'índice.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Limpio Iniciado"));
