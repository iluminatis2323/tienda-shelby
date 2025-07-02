require('dotenv').config();  // Cargar las variables de entorno desde .env
const { Telegraf, Scenes, session, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ✅ Token del bot desde la variable de entorno
const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 6500959070;

// ✅ Archivos
const COMERCIANTES_FILE = path.join(__dirname, 'comerciantes.json');
const PRODUCTOS_FILE = path.join(__dirname, 'productos.json');

function cargarComerciantes() {
  if (!fs.existsSync(COMERCIANTES_FILE)) fs.writeFileSync(COMERCIANTES_FILE, '[]');
  return JSON.parse(fs.readFileSync(COMERCIANTES_FILE));
}

function guardarComerciantes(lista) {
  fs.writeFileSync(COMERCIANTES_FILE, JSON.stringify(lista, null, 2));
}

function cargarProductos() {
  if (!fs.existsSync(PRODUCTOS_FILE)) fs.writeFileSync(PRODUCTOS_FILE, '[]');
  return JSON.parse(fs.readFileSync(PRODUCTOS_FILE));
}

function guardarProductos(lista) {
  fs.writeFileSync(PRODUCTOS_FILE, JSON.stringify(lista, null, 2));
}

// ✅ Registro de comerciantes
bot.start((ctx) => {
  ctx.reply('👋 ¡Bienvenido! Usá /registrar para darte de alta como comerciante.');
});

bot.command('registrar', (ctx) => {
  const user = ctx.from;
  const comerciantes = cargarComerciantes();

  if (comerciantes.find(c => c.id === user.id)) {
    return ctx.reply('🟡 Ya estás registrado como comerciante.');
  }

  const nuevo = {
    id: user.id,
    nombre: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    contacto: user.username ? '@' + user.username : 'Sin username'
  };

  comerciantes.push(nuevo);
  guardarComerciantes(comerciantes);
  ctx.reply('✅ ¡Registro exitoso! Ahora podés usar /subir para cargar productos.');
});

// ✅ ESCENA PARA SUBIR PRODUCTOS
const subir = new Scenes.WizardScene('subir-producto',
  (ctx) => {
    const comerciantes = cargarComerciantes();
    if (!comerciantes.find(c => c.id === ctx.from.id)) {
      return ctx.reply('❌ No estás registrado. Usá /registrar primero.');
    }
    ctx.session.fotos = [];
    ctx.reply('📸 Enviame 3 o 4 fotos del producto (una por mensaje). Escribí "listo" cuando termines.');
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text?.toLowerCase() === 'listo') {
      if (ctx.session.fotos.length < 3) {
        return ctx.reply('⚠️ Debés enviar al menos 3 fotos.');
      }
      ctx.reply('🛍️ Ingresá el *título del producto*', { parse_mode: 'Markdown' });
      return ctx.wizard.next();
    }
    if (!ctx.message.photo) return ctx.reply('❗Solo se aceptan fotos o el texto "listo"');
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    ctx.session.fotos.push(fileId);
    ctx.reply(`✅ Foto ${ctx.session.fotos.length} recibida.`);
  },
  (ctx) => {
    ctx.session.titulo = ctx.message.text;
    ctx.reply('✍️ Escribí una descripción del producto.');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.descripcion = ctx.message.text;
    ctx.reply('📂 Elegí una categoría:', Markup.keyboard([
      ['💸 Préstamos personales', '📱 Celulares y accesorios'],
      ['💻 Notebooks y tecnología', '🛏️ Electrodomésticos y muebles'],
      ['🪑 Hogar', '🎒 Útiles escolares'],
      ['💰 Herramientas']
    ]).oneTime().resize());
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.categoria = ctx.message.text;
    ctx.reply('💰 Ingresá el precio al contado (solo número, sin $)');
    return ctx.wizard.next();
  },
  (ctx) => {
    const precio = parseInt(ctx.message.text);
    if (isNaN(precio)) return ctx.reply('❌ Debe ser un número. Ingresá solo el precio.');
    ctx.session.precio = precio;
    ctx.reply('📱 Ingresá tu número de WhatsApp.');
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.whatsapp = ctx.message.text;
    ctx.reply('🏪 Ingresá el *nombre de tu tienda*', { parse_mode: 'Markdown' });
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.tienda = ctx.message.text;

    // Guardar producto
    const productos = cargarProductos();
    productos.push({
      fotos: ctx.session.fotos,
      titulo: ctx.session.titulo,
      descripcion: ctx.session.descripcion,
      categoria: ctx.session.categoria,
      precio: ctx.session.precio,
      whatsapp: ctx.session.whatsapp,
      tienda: ctx.session.tienda,
      vendedor_id: ctx.from.id
    });
    guardarProductos(productos);

    ctx.reply('✅ Producto cargado exitosamente');

    // Notificar al ADMIN
    bot.telegram.sendMessage(ADMIN_ID, `🆕 Nuevo producto:
📌 ${ctx.session.titulo}
💰 $${ctx.session.precio}
📱 ${ctx.session.whatsapp}
🏪 ${ctx.session.tienda}`);

    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([subir]);
bot.use(session());
bot.use(stage.middleware());
bot.command('subir', (ctx) => ctx.scene.enter('subir-producto'));

// ⏯️ Iniciar el bot
bot.launch();

// ✅ Exportar el bot para usarlo desde index.js
module.exports = { bot };

