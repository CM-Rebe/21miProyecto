function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}

function quitarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(item => item.id !== id);
    guardarCarrito(carrito);
}

function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === id);

    if (!item) return;
    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        quitarDelCarrito(id);
        return;
    }

    guardarCarrito(carrito);
}

function calcularTotal() {
    return obtenerCarrito().reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function formatearPrecio(numero) {
    return "$" + Number(numero).toLocaleString("es-AR");
}