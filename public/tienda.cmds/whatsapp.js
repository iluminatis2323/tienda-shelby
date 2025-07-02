import { carrito } from './carrito.js';

export function enviarCarritoWhatsApp() {
  if (carrito.length === 0) return alert("El carrito está vacío");

  let mensaje = "Hola! Quiero estos productos:%0A";
  carrito.forEach(p => {
    mensaje += `- ${p.nombre} x${p.cantidad} ($${p.precio * p.cantidad})%0A`;
  });
  mensaje += `%0ATotal: $${carrito.reduce((a, b) => a + b.precio * b.cantidad, 0)}`;

  window.open(`https://wa.me/5493813885182?text=${mensaje}`, '_blank');
}
