// Lista de productos de productos.html 
const contenedor = document.querySelector("#productos");
const titulo = document.querySelector("#tituloCategoria");

// Leemos la categoría de la URL
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