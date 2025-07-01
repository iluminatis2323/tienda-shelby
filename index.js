const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// En Render o Heroku, el puerto lo da la variable de entorno PORT,
// si no está definida, usamos 3000 para desarrollo local
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON desde el cliente
app.use(express.json());

// CORS para que AppCreator24 u otros clientes puedan acceder
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

  // Aquí luego lo conectamos con Telegram o base de datos
  res.json({ mensaje: "Pedido recibido correctamente ✅" });
});

// Iniciar el servidor en el puerto correcto (Render asigna el puerto dinámicamente)
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
