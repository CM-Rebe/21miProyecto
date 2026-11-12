const modal = document.querySelector("#modalProducto");
const mensajeOk = document.querySelector("#mensajeOk");

let productoActual = null; 

function abrirProducto(id) {
    fetch(`/productos/${id}`)
        .then(respuesta => respuesta.json())
        .then(producto => {
            if (!producto.nombre) return; // producto no encontrado

            productoActual = producto;

            document.querySelector("#modalImagen").src = producto.imagen;
            document.querySelector("#modalImagen").alt = producto.nombre;
            document.querySelector("#modalNombre").textContent = producto.nombre;
            document.querySelector("#modalDescripcion").textContent = producto.descripcion || "";
            document.querySelector("#modalPrecio").textContent = formatearPrecio(producto.precio);

            mensajeOk.classList.add("oculto"); // oculta el mensaje anterior
            modal.classList.add("abierto");
        });
}

function cerrarProducto() {
    modal.classList.remove("abierto");
}

document.querySelector("#btnAgregar").addEventListener("click", () => {
    agregarAlCarrito(productoActual);
    mensajeOk.classList.remove("oculto"); 
});

document.querySelector("#cerrarModal").addEventListener("click", cerrarProducto);

modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        cerrarProducto();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarProducto();
    }
});