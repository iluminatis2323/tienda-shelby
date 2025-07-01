const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para leer JSON desde el cliente
app.use(express.json());

// CORS para que AppCreator24 pueda acceder
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Ruta para obtener los productos desde productos.json
app.get('/productos', (req, res) => {
  const productosPath = path.join(__dirname, 'productos.json');
  fs.readFile(productosPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer productos:", err);
      return res.status(500).json({ error: "Error al leer los productos" });
    }
    res.send(JSON.parse(data));
  });
});

// Ruta para recibir pedidos
app.post('/pedido', (req, res) => {
  const pedido = req.body;
  console.log("📦 Pedido recibido:", pedido);

  // Aquí luego lo conectamos con Telegram
  res.json({ mensaje: "Pedido recibido correctamente ✅" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
