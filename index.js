const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_RENDER = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';

// Middleware JSON
app.use(express.json());

// CORS para AppCreator24 o frontend externo
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 📦 Ruta: obtener productos
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

// 🛒 Ruta: recibir pedido desde frontend y reenviar a Telegram
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

// 🌐 Fallback: servir index.html en rutas no reconocidas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ▶️ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// 🧠 Lógica para activar el bot solo si querés
if (!IS_RENDER) {
  try {
    const { bot } = require('./bot.js');
    bot.launch();
    console.log("🤖 Bot de Telegram iniciado (modo local)");
  } catch (e) {
    console.warn("⚠️ Bot no cargado. ¿Falta bot.js o BOT_TOKEN?");
  }
}





