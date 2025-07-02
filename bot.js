require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Cargar comandos automáticamente desde la carpeta comandos/
const comandosPath = path.join(__dirname, 'comandos');
fs.readdirSync(comandosPath).forEach((archivo) => {
  if (archivo.endsWith('.js')) {
    const comando = require(path.join(comandosPath, archivo));
    if (typeof comando === 'function') {
      comando(bot);
    }
  }
});

bot.launch();
console.log('✅ Bot iniciado');

