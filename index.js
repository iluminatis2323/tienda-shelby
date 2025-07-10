const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_RENDER = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';

console.log(`🔄 IS_RENDER: ${IS_RENDER}`);  // Log de entorno (Render o local)

// Middleware JSON
app.use(express.json());

// CORS para AppCreator24 o frontend externo
app.use((req, res, next) => {
  console.log(`🔄 CORS Middleware ejecutado para ${req.method} ${req.url}`);  // Log de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 📦 Ruta: obtener productos
app.get('/api/productos', (req, res) => {
  const productosPath = path.join(__dirname, 'productos.json');
  console.log(`🔄 Intentando leer productos desde: ${productosPath}`);  // Log de ruta
  fs.readFile(productosPath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Error al leer productos:", err);
      return res.status(500).json({ error: "Error al leer los productos" });
    }
    console.log(`📦 Productos leídos exitosamente: ${data}`);  // Log de éxito
    res.json(JSON.parse(data));
  });
});

// 🛒 Ruta: recibir pedido desde frontend y reenviar a Telegram
app.post('/api/pedido', async (req, res) => {
  const pedido = req.body;
  console.log('🛒 Pedido recibido:', pedido);  // Log del pedido recibido

  const cliente = pedido.cliente || "Cliente anónimo";
  const mensaje = `🛒 *Nuevo Pedido Recibido*\n` +
    `👤 Cliente: ${cliente}\n` +
    `📦 Productos:\n` +
    pedido.carrito.map(p => `- ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}`).join('\n') +
    `\n\n💰 Total: $${pedido.carrito.reduce((a, b) => a + b.precio * b.cantidad, 0)}`;

  try {
    const { bot } = require('./bot.js');
    console.log("🔄 Enviando mensaje a Telegram...");  // Log antes de enviar el mensaje
    await bot.telegram.sendMessage(6500959070, mensaje, { parse_mode: 'Markdown' });
    console.log("✅ Mensaje enviado a Telegram");  // Log de éxito
    res.json({ mensaje: "✅ Pedido enviado correctamente" });
  } catch (err) {
    console.error("❌ Error al enviar a Telegram:", err);
    res.status(500).json({ mensaje: "❌ Error al enviar a Telegram" });
  }
});

// 🌐 Fallback: servir index.html en rutas no reconocidas
app.get('*', (req, res) => {
  console.log(`🌍 Ruta no encontrada: ${req.method} ${req.url}. Sirviendo index.html`);  // Log de ruta no encontrada
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ▶️ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);  // Log de servidor iniciado
});

// 🧠 Lógica para activar el bot solo si querés
console.log("🔄 Verificando si el bot debe iniciarse en modo local...");

if (!IS_RENDER) {
  console.log("🔄 Bot se está ejecutando en modo local...");
  try {
    const { bot } = require('./bot.js');
    console.log("🔄 Intentando iniciar el bot...");
    
    // Verificar si el bot ya está en ejecución
    if (bot.launch) {
      console.log("🔄 Lanzando bot...");
      bot.launch();
      console.log("🤖 Bot de Telegram iniciado (modo local)");  // Log de bot iniciado
    } else {
      console.warn("⚠️ El bot no tiene la función 'launch' o ya está en ejecución");
    }
  } catch (e) {
    console.warn("⚠️ Bot no cargado. ¿Falta bot.js o BOT_TOKEN?");
    console.error(e);
  }
} else {
  console.log("🔄 El bot no se iniciará en Render (modo de producción)");
}








