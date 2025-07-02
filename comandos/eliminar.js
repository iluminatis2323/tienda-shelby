const { obtenerProductos, guardarProductos } = require('../helpers/productos');

module.exports = (bot) => {
  bot.command('eliminar', async (ctx) => {
    const partes = ctx.message.text.split(' ');
    const id = parseInt(partes[1]);

    if (isNaN(id)) {
      return ctx.reply('🗑️ Uso correcto: /eliminar [id]');
    }

    const productos = await obtenerProductos();
    if (!productos[id]) return ctx.reply('❌ Producto no encontrado');

    if (productos[id].creador !== ctx.from.id.toString()) {
      return ctx.reply('🚫 No podés eliminar productos de otro comerciante.');
    }

    const eliminado = productos.splice(id, 1);
    await guardarProductos(productos);

    ctx.reply(`✅ Producto eliminado: ${eliminado[0].nombre}`);
  });
};
