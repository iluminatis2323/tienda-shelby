const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ✅ Token de tu bot
const bot = new Telegraf('7317600622:AAFPhQ3ggoHl2tq-G_v6O132FxCjvdvKmhM');

// ✅ ID del dueño (vos)
const ADMIN_ID = TU_ID_AQUI; // <-- lo reemplazamos ahora

// ✅ Archivo de comerciantes
const COMERCIANTES_FILE = path.join(__dirname, 'comerciantes.json');

// Cargar comerciantes (si no existe, crear vacío)
function cargarComerciantes() {
  if (!fs.existsSync(COMERCIANTES_FILE)) {
    fs.writeFileSync(COMERCIANTES_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(COMERCIANTES_FILE));
}

function guardarComerciantes(comerciantes) {
  fs.writeFileSync(COMERCIANTES_FILE, JSON.stringify(comerciantes, null, 2));
}

// /start y /registrar
bot.start((ctx) => {
  ctx.reply('👋 ¡Bienvenido al sistema de comerciantes! Escribí /registrar para darte de alta.');
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
  ctx.reply('✅ ¡Registro exitoso! Ya podés subir productos.');
});

bot.launch();
