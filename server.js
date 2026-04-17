const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión segura a tu base de datos en la nube
const mongoURI = "mongodb+srv://jjesussanchez_db_user:k48rPWmOrNmVcPkB@cluster0.hghhfcz.mongodb.net/sitio_herradura?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema para el Control de Personal (100+ operadores)
const OperadorSchema = new mongoose.Schema({
    nombre: String,
    gafete: String,
    vencimiento: String,
    beneficiario: String,
    parentesco: String
});

const Operador = mongoose.model('Operador', OperadorSchema);

// Rutas para jalar y guardar datos
app.get('/api/operadores', async (req, res) => {
    const operadores = await Operador.find();
    res.json(operadores);
});

app.post('/api/operadores', async (req, res) => {
    const nuevo = new Operador(req.body);
    await nuevo.save();
    res.json({ status: "Operador guardado en la nube" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
