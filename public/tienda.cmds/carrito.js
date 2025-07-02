import { mostrarNotificacion } from './utils.js';

export let carrito = [];

const btnCarrito = document.getElementById('btnCarrito');
const panelCarrito = document.getElementById('panelCarrito');
const cerrarPanel = document.getElementById('cerrarPanel');

btnCarrito.addEventListener('click', () => {
  panelCarrito.style.display = 'block';
});

cerrarPanel.addEventListener('click', () => {
  panelCarrito.style.display = 'none';
});

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
  if (item.cantidad < 1) {
    quitarDelCarrito(nombre);
  } else {
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
    suma += p.precio * p.cantidad;
    lista.innerHTML += `
      <li>
        <span title="${p.nombre}">${p.nombre.length > 20 ? p.nombre.slice(0, 17) + '...' : p.nombre}</span>
        <span>$${p.precio.toLocaleString('es-AR')} x ${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString('es-AR')}</span>
        <button class="btn-cantidad" onclick="window.cambiarCantidad('${p.nombre}', 1)">+</button>
        <button class="btn-cantidad" onclick="window.cambiarCantidad('${p.nombre}', -1)">-</button>
        <button class="btn-quitar" onclick="window.quitarDelCarrito('${p.nombre}')">×</button>
      </li>
    `;
  });

  total.textContent = suma.toLocaleString('es-AR');
}

// Estas funciones expuestas para que el onclick en los botones dentro del HTML funcione
window.cambiarCantidad = cambiarCantidad;
window.quitarDelCarrito = quitarDelCarrito;

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

