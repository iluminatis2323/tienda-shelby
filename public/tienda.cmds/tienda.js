let productos = [];
let carrito = [];

// 🎯 Utilidad para normalizar un producto
function formatearProducto(p) {
  return {
    nombre: p.nombre || "Producto sin nombre",
    precio: p.precio || 0,
    imagen: p.imagen || "https://via.placeholder.com/300x180?text=Sin+Imagen",
    envio: p.envio ? '🚚 Envío' : '',
    oferta: p.oferta ? '🏷️ Oferta' : '',
    cuotas: p.cuotas ? '💳 Cuotas' : ''
  };
}

// 🧩 Renderizar productos
function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = productos.map((p) => {
    const { nombre, precio, imagen, envio, oferta, cuotas } = formatearProducto(p);
    return `
      <div class="card">
        <img src="${imagen}" alt="${nombre}" />
        <h3>${nombre}</h3>
        <p><strong>Contado:</strong> $${precio.toLocaleString('es-AR')}</p>
        <p><strong>4 cuotas:</strong> $${(precio * 1.4).toFixed(0).toLocaleString('es-AR')}</p>
        <p>${envio} ${oferta} ${cuotas}</p>
        <button class="comprar" onclick="agregarAlCarrito('${nombre}', ${precio})">Agregar al carrito</button>
        <a href="https://wa.me/5493813885182?text=Hola! Quiero este producto: ${encodeURIComponent(nombre)}" target="_blank">
          <button class="comprar">Solicitar por WhatsApp</button>
        </a>
      </div>`;
  }).join('');
}

function filtrarProductos() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const cat = document.getElementById("categoria").value;

  const filtrados = productos.filter(p =>
    (p.nombre || "").toLowerCase().includes(texto) &&
    (!cat || p.categoria === cat)
  );

  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = filtrados.map((p) => {
    const { nombre, precio, imagen, envio, oferta, cuotas } = formatearProducto(p);
    return `
      <div class="card">
        <img src="${imagen}" alt="${nombre}" />
        <h3>${nombre}</h3>
        <p><strong>Contado:</strong> $${precio.toLocaleString('es-AR')}</p>
        <p><strong>4 cuotas:</strong> $${(precio * 1.4).toFixed(0).toLocaleString('es-AR')}</p>
        <p>${envio} ${oferta} ${cuotas}</p>
        <button class="comprar" onclick="agregarAlCarrito('${nombre}', ${precio})">Agregar al carrito</button>
        <a href="https://wa.me/5493813885182?text=Hola! Quiero este producto: ${encodeURIComponent(nombre)}" target="_blank">
          <button class="comprar">Solicitar por WhatsApp</button>
        </a>
      </div>`;
  }).join('');
}

function agregarAlCarrito(nombre, precio) {
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

function quitarDelCarrito(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion("❌ Eliminado del carrito");
}

function cambiarCantidad(nombre, delta) {
  const item = carrito.find(p => p.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad < 1) quitarDelCarrito(nombre);
  else {
    guardarCarrito();
    actualizarCarrito();
  }
}

function actualizarCarrito() {
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

function guardarCarrito() {
  localStorage.setItem("carritoShelby", JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem("carritoShelby");
  if (guardado) {
    carrito = JSON.parse(guardado);
    actualizarCarrito();
  }
}

function enviarCarritoWhatsApp() {
  if (carrito.length === 0) return alert("El carrito está vacío");

  let mensaje = "Hola! Quiero estos productos:%0A";
  carrito.forEach(p => {
    mensaje += `- ${p.nombre} x${p.cantidad} ($${p.precio * p.cantidad})%0A`;
  });
  mensaje += `%0ATotal: $${carrito.reduce((a, b) => a + b.precio * b.cantidad, 0)}`;

  window.open(`https://wa.me/5493813885182?text=${mensaje}`, '_blank');
}

function simularPago() {
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

function mostrarNotificacion(msg) {
  const n = document.getElementById("notificacion");
  n.textContent = msg;
  n.style.display = "block";
  setTimeout(() => n.style.display = "none", 2000);
}

// 🚀 Cargar productos al iniciar
window.onload = async () => {
  try {
    const res = await fetch('https://tienda-shelby.onrender.com/productos');
    productos = await res.json();
    console.log("📦 Productos cargados:", productos);
    mostrarProductos();
    cargarCarrito();
  } catch (err) {
    alert("❌ No se pudieron cargar los productos.");
    console.error(err);
  }
};


