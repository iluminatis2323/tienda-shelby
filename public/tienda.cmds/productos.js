export let productos = [];

const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
});

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
  contenedor.innerHTML = "";

  productos.forEach((p) => {
    const { nombre, precio, imagen, envio, oferta, cuotas } = formatearProducto(p);

    const card = document.createElement("div");
    card.className = "card animada";

    const img = document.createElement("img");
    img.src = imagen;
    img.alt = nombre;

    const h3 = document.createElement("h3");
    h3.textContent = nombre;

    const contado = document.createElement("p");
    contado.innerHTML = `<strong>Contado:</strong> ${formatoPesos.format(precio)}`;

    const cuotas4 = document.createElement("p");
    cuotas4.innerHTML = `<strong>4 cuotas:</strong> ${formatoPesos.format(precio * 1.4)}`;

    const etiquetas = document.createElement("p");
    etiquetas.innerHTML = `${envio} ${oferta} ${cuotas}`;

    const btnAgregar = document.createElement("button");
    btnAgregar.className = "comprar efecto-boton";
    btnAgregar.textContent = "🛒 Agregar al carrito";
    btnAgregar.addEventListener("click", () => agregarAlCarrito(nombre, precio));

    const linkWsp = document.createElement("a");
    linkWsp.href = `https://wa.me/5493813885182?text=Hola! Quiero este producto: ${encodeURIComponent(nombre)}`;
    linkWsp.target = "_blank";

    const btnWsp = document.createElement("button");
    btnWsp.className = "comprar efecto-wsp";
    btnWsp.textContent = "📲 Solicitar por WhatsApp";

    linkWsp.appendChild(btnWsp);

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(contado);
    card.appendChild(cuotas4);
    card.appendChild(etiquetas);
    card.appendChild(btnAgregar);
    card.appendChild(linkWsp);

    contenedor.appendChild(card);
  });
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



