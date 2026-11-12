const lista = document.querySelector("#listaCarrito");
const resumen = document.querySelector("#resumenCarrito");
const totalCarrito = document.querySelector("#totalCarrito");
const mensajeCompra = document.querySelector("#mensajeCompra");

// LUEGO: número: código de país + área + número, sin "+" ni espacios
const NUMERO_WHATSAPP = "00000";

function mostrarCarrito() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="index.html#categorias">¡Mirá nuestros productos!</a></p>`;
        resumen.classList.add("oculto");
        mensajeCompra.classList.add("oculto");
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <img class="carrito-imagen" src="${item.imagen}" alt="${item.nombre}">

            <div class="carrito-datos">
                <h3 class="categoria-nombre">${item.nombre}</h3>
                <p class="categoria-desc">${formatearPrecio(item.precio)} c/u</p>
            </div>

            <div class="carrito-cantidad">
                <button class="btn-cantidad" data-id="${item.id}" data-cambio="-1">−</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" data-id="${item.id}" data-cambio="1">+</button>
            </div>

            <p class="carrito-subtotal">${formatearPrecio(item.precio * item.cantidad)}</p>
            <button class="btn-quitar" data-id="${item.id}">Quitar</button>
        </div>
    `).join("");

    totalCarrito.textContent = formatearPrecio(calcularTotal());
    resumen.classList.remove("oculto");
}

lista.addEventListener("click", evento => {
    const id = Number(evento.target.dataset.id);

    if (evento.target.classList.contains("btn-cantidad")) {
        cambiarCantidad(id, Number(evento.target.dataset.cambio));
        mostrarCarrito();
    }

    if (evento.target.classList.contains("btn-quitar")) {
        quitarDelCarrito(id);
        mostrarCarrito();
    }
});

document.querySelector("#btnComprar").addEventListener("click", () => {
    const carrito = obtenerCarrito();

    let texto = "¡Hola! Quiero hacer este pedido:\n";
    carrito.forEach(item => {
        texto += `- ${item.nombre} x${item.cantidad}: ${formatearPrecio(item.precio * item.cantidad)}\n`;
    });
    texto += `Total: ${formatearPrecio(calcularTotal())}`;

    document.querySelector("#enlaceWhatsapp").href =
        `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

    mensajeCompra.classList.remove("oculto");
});

mostrarCarrito();