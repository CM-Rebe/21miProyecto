const contenedor = document.querySelector("#productos");
const titulo = document.querySelector("#tituloCategoria");
const modal = document.querySelector("#modalProducto");
const mensajeOk = document.querySelector("#mensajeOk");

let productoActual = null; 

const parametros = new URLSearchParams(window.location.search);
const categoriaId = parametros.get("categoria");

if (categoriaId) {
    fetch(`/categorias/${categoriaId}`)
        .then(respuesta => respuesta.json())
        .then(categoria => {
            if (categoria.nombre) {
                titulo.textContent = categoria.nombre;
            }
        });
} else {
    titulo.textContent = "Todos los productos";
}

const url = categoriaId ? `/productos?categoria=${categoriaId}` : "/productos";

fetch(url)
    .then(respuesta => respuesta.json())
    .then(productos => {
        if (productos.length === 0) {
            contenedor.innerHTML = "<p>Todavía no hay productos en esta categoría.</p>";
            return;
        }

        contenedor.innerHTML = productos.map(producto => `
            <div class="categoria-card">
                <img class="superImagen" src="${producto.imagen}" alt="${producto.nombre}">
                <h3 class="categoria-nombre">${producto.nombre}</h3>
                <p class="categoria-desc">${formatearPrecio(producto.precio)}</p>
                <button class="categoria-btn btn-ver" data-id="${producto.id}">Ver producto</button>
            </div>
        `).join("");
    });

contenedor.addEventListener("click", evento => {
    if (evento.target.classList.contains("btn-ver")) {
        abrirProducto(evento.target.dataset.id);
    }
});

function abrirProducto(id) {
    fetch(`/productos/${id}`)
        .then(respuesta => respuesta.json())
        .then(producto => {
            productoActual = producto;

            document.querySelector("#modalImagen").src = producto.imagen;
            document.querySelector("#modalImagen").alt = producto.nombre;
            document.querySelector("#modalNombre").textContent = producto.nombre;
            document.querySelector("#modalDescripcion").textContent = producto.descripcion || "";
            document.querySelector("#modalPrecio").textContent = formatearPrecio(producto.precio);

            mensajeOk.classList.add("oculto");
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