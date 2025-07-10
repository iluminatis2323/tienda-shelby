const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Puerto dinámico para Render o 3000 en local
const PORT = process.env.PORT || 3000;

// Middleware para recibir JSON
app.use(express.json());

// CORS para permitir acceso desde AppCreator24 u otros orígenes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Servir archivos estáticos (index.html, tienda.js, etc.) desde /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Ruta: obtener productos (¡usamos /api para evitar conflicto con productos.js!)
app.get('/api/productos', (req, res) => {
  const productosPath = path.join(__dirname, 'productos.json');
  fs.readFile(productosPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error al leer productos:", err);
      return res.status(500).json({ error: "Error al leer los productos" });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta: recibir pedido desde frontend y notificar al admin
app.post('/api/pedido', async (req, res) => {
  const pedido = req.body;
  const cliente = pedido.cliente || "Cliente anónimo";

  const mensaje = `🛒 *Nuevo Pedido Recibido*\n` +
    `👤 Cliente: ${cliente}\n` +
    `📦 Productos:\n` +
    pedido.carrito.map(p => `- ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}`).join('\n') +
    `\n\n💰 Total: $${pedido.carrito.reduce((a, b) => a + b.precio * b.cantidad, 0)}`;

  try {
    const { bot } = require('./bot.js');
    await bot.telegram.sendMessage(6500959070, mensaje, { parse_mode: 'Markdown' });
    res.json({ mensaje: "✅ Pedido enviado correctamente" });
  } catch (err) {
    console.error("❌ Error al enviar a Telegram:", err);
    res.status(500).json({ mensaje: "❌ Error al enviar a Telegram" });
  }
});

// Ruta final: para todo lo demás, devolver index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

// 🔥 IMPORTANTE: Comentá esta línea si hacés pruebas locales con otra instancia
// Descomentar solo en producción o cuando no estés ejecutando el bot en tu PC
// require('./bot.js');





