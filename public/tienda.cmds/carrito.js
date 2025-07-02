import { mostrarNotificacion } from './utils.js';

export let carrito = [];

export function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion("✅ Agregado al carrito");
}

export function quitarDelCarrito(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion("❌ Eliminado del carrito");
}

export function cambiarCantidad(nombre, delta) {
  const item = carrito.find(p => p.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad < 1) quitarDelCarrito(nombre);
  else {
    guardarCarrito();
    actualizarCarrito();
  }
}

export function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const total = document.getElementById("totalCarrito");
  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach(p => {
    lista.innerHTML += `
      <li>
        ${p.nombre} - $${p.precio} x ${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString('es-AR')}
        <button class="btn-cantidad" onclick="cambiarCantidad('${p.nombre}', 1)">+</button>
        <button class="btn-cantidad" onclick="cambiarCantidad('${p.nombre}', -1)">-</button>
        <button class="btn-quitar" onclick="quitarDelCarrito('${p.nombre}')">❌</button>
      </li>`;
    suma += p.precio * p.cantidad;
  });

  total.textContent = suma.toLocaleString('es-AR');
}

export function guardarCarrito() {
  localStorage.setItem("carritoShelby", JSON.stringify(carrito));
}

export function cargarCarrito() {
  const guardado = localStorage.getItem("carritoShelby");
  if (guardado) {
    carrito = JSON.parse(guardado);
    actualizarCarrito();
  }
}
