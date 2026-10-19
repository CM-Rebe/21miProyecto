function obtenerProducto() {
    app.get("/productos", (solicitud, respuesta) => {
        respuesta.json(productos);
    });

    app.get("/productos/:id", (solicitud, respuesta) => {

        const id = Number(solicitud.params.id);

        const producto = productos.find(producto => producto.id === id);

        if (!producto) {
            return respuesta.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        respuesta.json(producto);
    });
};

module.exports = obtenerProducto();