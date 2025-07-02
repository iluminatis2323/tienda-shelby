import { carrito } from './carrito.js';

export function simularPago() {
  if (carrito.length === 0) return alert("🛒 El carrito está vacío");

  let cliente = localStorage.getItem("clienteNombre") || prompt("📞 Ingresá tu nombre o número de WhatsApp:");
  if (!cliente || cliente.trim() === "") return alert("⚠️ Debes ingresar un nombre o número");

  localStorage.setItem("clienteNombre", cliente);

  fetch('https://tienda-shelby.onrender.com/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carrito, cliente })
  })
  .then(res => res.json())
  .then(data => alert("✅ Pedido enviado correctamente.\n" + data.mensaje))
  .catch(() => alert("❌ Error al enviar el pedido al servidor"));
}
