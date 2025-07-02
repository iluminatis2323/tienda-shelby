const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Puerto dinámico para Render o 3000 para desarrollo local
const PORT = process.env.PORT || 3000;

// Middleware para recibir JSON
app.use(express.json());

// CORS: permitir acceso desde cualquier origen
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Servir archivos estáticos desde /public (por ejemplo, index.html si lo usás)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta: obtener productos
app.get('/productos', (req, res) => {
  const productosPath = path.join(__dirname, 'productos.json');
  fs.readFile(productosPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error al leer productos:", err);
      return res.status(500).json({ error: "Error al leer los productos" });
    }
    res.send(JSON.parse(data));
  });
});

// Ruta: recibir pedido
app.post('/pedido', (req, res) => {
  const pedido = req.body;
  console.log("📦 Pedido recibido:", pedido);

  // 👉 Aquí podrías notificar por Telegram al comerciante correspondiente

  res.json({ mensaje: "Pedido recibido correctamente ✅" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

// Ejecutar el bot de Telegram automáticamente
require('./bot.js');


