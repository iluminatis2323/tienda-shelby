import { mostrarNotificacion } from './utils.js';

export let carrito = [];

// Función para agregar un producto al carrito
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

// Función para quitar un producto completo del carrito
export function quitarDelCarrito(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion("❌ Eliminado del carrito");
}

// Cambiar la cantidad de un producto en el carrito, suma o resta según delta
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

// Actualiza el contenido visual del carrito en el DOM
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

// Guarda el carrito en localStorage
export function guardarCarrito() {
  localStorage.setItem("carritoShelby", JSON.stringify(carrito));
}

// Carga el carrito desde localStorage y actualiza el DOM
export function cargarCarrito() {
  const guardado = localStorage.getItem("carritoShelby");
  if (guardado) {
    carrito = JSON.parse(guardado);
    actualizarCarrito();
  }
}

// Exponer funciones para que funcionen los onclick en el HTML
window.cambiarCantidad = cambiarCantidad;
window.quitarDelCarrito = quitarDelCarrito;


