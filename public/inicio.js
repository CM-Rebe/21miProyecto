// Botón "Ir" de Más Vendido: abre la card del producto
document.querySelector("#btnMasVendido").addEventListener("click", evento => {
    evento.preventDefault(); // evita que la página salte arriba
    abrirProducto(evento.currentTarget.dataset.id);
});