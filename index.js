const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Si estás en Render o Heroku, usá el puerto asignado por el entorno
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON desde el cliente (POST)
app.use(express.json());

// Middleware CORS para permitir acceso desde cualquier origen (AppCreator24, etc)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Ruta: Obtener productos desde productos.json
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

// Ruta: Recibir pedido (cliente hizo clic en simular pago)
app.post('/pedido', (req, res) => {
  const pedido = req.body;
  console.log("📦 Pedido recibido:", pedido);

  // 🔗 Aquí podés enviar el pedido por Telegram al comerciante correspondiente

  res.json({ mensaje: "Pedido recibido correctamente ✅" });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

// 📢 IMPORTANTE: Ejecutar el bot de Telegram al mismo tiempo
require('./bot.js');

