const { obtenerProductos, guardarProductos } = require('../helpers/productos');

module.exports = (bot) => {
  bot.command('editar', async (ctx) => {
    const partes = ctx.message.text.split(' ');
    const id = parseInt(partes[1]);
    const nuevoNombre = partes[2];
    const nuevoPrecio = parseFloat(partes[3]);

    if (isNaN(id) || !nuevoNombre || isNaN(nuevoPrecio)) {
      return ctx.reply('✏️ Uso correcto: /editar [id] [nuevo_nombre] [nuevo_precio]');
    }

    const productos = await obtenerProductos();
    if (!productos[id]) return ctx.reply('❌ Producto no encontrado');

    if (productos[id].creador !== ctx.from.id.toString()) {
      return ctx.reply('🚫 No podés editar productos de otro comerciante.');
    }

    productos[id].nombre = nuevoNombre;
    productos[id].precio = nuevoPrecio;
    await guardarProductos(productos);

    ctx.reply('✅ Producto actualizado correctamente.');
  });
};
