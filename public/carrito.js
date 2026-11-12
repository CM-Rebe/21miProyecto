const lista = document.querySelector("#listaCarrito");
const resumen = document.querySelector("#resumenCarrito");
const totalCarrito = document.querySelector("#totalCarrito");
const btnComprar = document.querySelector("#btnComprar");
const formulario = document.querySelector("#formularioCompra");
const mensajeError = document.querySelector("#mensajeError");
const mensajeCompra = document.querySelector("#mensajeCompra");

// LUEGO!!!!!!!!!!!! número: código de país + área + número, sin "+" ni espacios
const NUMERO_WHATSAPP = "00000";

function mostrarCarrito() {
    const carrito = obtenerCarrito();

    // Carrito vacío
    if (carrito.length === 0) {
        lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="index.html#categorias">¡Mirá nuestros productos!</a></p>`;
        resumen.classList.add("oculto");
        formulario.classList.add("oculto");
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

            <label class="carrito-personalizado">
                <input type="checkbox" class="check-personalizado" data-id="${item.id}" ${item.personalizado ? "checked" : ""}>
                Personalizado
            </label>

            <p class="carrito-subtotal">${formatearPrecio(item.precio * item.cantidad)}</p>
            <button class="btn-quitar" data-id="${item.id}">Quitar</button>
        </div>
    `).join("");

    totalCarrito.textContent = formatearPrecio(calcularTotal());
    resumen.classList.remove("oculto");
}

// cantidad y quitar
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

// Personalizado
lista.addEventListener("change", evento => {
    if (evento.target.classList.contains("check-personalizado")) {
        cambiarPersonalizado(Number(evento.target.dataset.id), evento.target.checked);
    }
});

// Comprar
btnComprar.addEventListener("click", () => {
    btnComprar.classList.add("oculto");
    formulario.classList.remove("oculto");
    formulario.scrollIntoView({ behavior: "smooth" });
});

// Volver
document.querySelector("#btnVolver").addEventListener("click", () => {
    formulario.classList.add("oculto");
    btnComprar.classList.remove("oculto");
});

// Enviar el formulario
formulario.addEventListener("submit", async evento => {
    evento.preventDefault(); // evita que la página se recargue

    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    const botonEnviar = formulario.querySelector("button[type='submit']");
    botonEnviar.disabled = true; // evita enviar dos veces
    mensajeError.classList.add("oculto");

    const datos = {
        persona: {
            nombre: formulario.nombre.value.trim(),
            mail: formulario.mail.value.trim(),
            telefono: formulario.telefono.value.trim()
        },
        productos: carrito.map(item => ({
            id: item.id,
            cantidad: item.cantidad,
            personalizado: Boolean(item.personalizado)
        }))
    };

    try {
        const respuesta = await fetch("/compras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarError(resultado.mensaje);
            return;
        }

        mostrarConfirmacion(resultado.numero, carrito);
    } catch (error) {
        mostrarError("No pudimos conectar con el servidor. Probá de nuevo.");
    } finally {
        botonEnviar.disabled = false;
    }
});

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove("oculto");
}

// compra guardada
function mostrarConfirmacion(numero, carrito) {
    // Armamos el texto del pedido antes de vaciar el carrito
    let texto = `¡Hola! Hice el pedido N° ${numero}:\n`;
    carrito.forEach(item => {
        const personalizado = item.personalizado ? " (personalizado)" : "";
        texto += `- ${item.nombre} x${item.cantidad}${personalizado}: ${formatearPrecio(item.precio * item.cantidad)}\n`;
    });
    texto += `Total: ${formatearPrecio(calcularTotal())}`;

    document.querySelector("#numeroCarrito").textContent = numero;
    document.querySelector("#enlaceWhatsapp").href =
        `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

    guardarCarrito([]); // el carrito se vacía

    lista.classList.add("oculto");
    resumen.classList.add("oculto");
    formulario.classList.add("oculto");
    mensajeCompra.classList.remove("oculto");
}

mostrarCarrito();