import { cargarCarrito, agregarAlCarrito } from './carrito.js';
import { mostrarProductos } from './productos.js';
import { simularPago } from './simulador.js';
import { enviarCarritoWhatsApp } from './whatsapp.js';

let productos = [];

window.agregarAlCarrito = agregarAlCarrito;
window.simularPago = simularPago;
window.enviarCarritoWhatsApp = enviarCarritoWhatsApp;

window.onload = async () => {
  try {
    const res = await fetch('https://tienda-shelby.onrender.com/productos');
    productos = await res.json();
    console.log("📦 Productos cargados:", productos);
    mostrarProductos(productos, agregarAlCarrito);
    cargarCarrito();
  } catch (err) {
    alert("❌ No se pudieron cargar los productos.");
    console.error(err);
  }
};
