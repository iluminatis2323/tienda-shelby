export let productos = [];

export function formatearProducto(p) {
  return {
    nombre: p.nombre || "Producto sin nombre",
    precio: p.precio || 0,
    imagen: p.imagen || "https://via.placeholder.com/300x180?text=Sin+Imagen",
    envio: p.envio ? '🚚 Envío' : '',
    oferta: p.oferta ? '🏷️ Oferta' : '',
    cuotas: p.cuotas ? '💳 Cuotas' : ''
  };
}

export function mostrarProductos(productos, agregarAlCarrito) {
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

export function filtrarProductos(productos, agregarAlCarrito) {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const cat = document.getElementById("categoria").value;

  const filtrados = productos.filter(p =>
    (p.nombre || "").toLowerCase().includes(texto) &&
    (!cat || p.categoria === cat)
  );

  mostrarProductos(filtrados, agregarAlCarrito);
}



