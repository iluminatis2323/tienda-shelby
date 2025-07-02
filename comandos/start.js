module.exports = (bot) => {
  bot.start((ctx) => {
    ctx.reply(`👋 ¡Bienvenido a la Tienda Shelby!\n¿Qué querés hacer?`, {
      reply_markup: {
        keyboard: [
          ['🆕 Subir producto', '📦 Mis productos'],
          ['📝 Editar producto', '❌ Eliminar producto']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  });
};
