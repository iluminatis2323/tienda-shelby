const { obtenerProductos } = require('../helpers/productos');

module.exports = (bot) => {
  bot.command('misproductos', async (ctx) => {
    const usuarioId = ctx.from.id.toString();
    const productos = await obtenerProductos();

    const propios = productos.filter(p => p.creador === usuarioId);

    if (propios.length === 0) {
      return ctx.reply('❌ No tenés productos cargados.');
    }

    propios.forEach((p, i) => {
      const texto = `🆔 ID: ${i}\n📦 ${p.nombre}\n💲 $${p.precio}`;
      ctx.replyWithPhoto(p.imagen, { caption: texto });
    });
  });
};
