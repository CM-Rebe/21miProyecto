const conexion = require("./conexion");
const db = conexion.promise(); // para usar async/await

async function crearCompra(solicitud, respuesta) {
    const { persona, productos } = solicitud.body;

    // ----- Validaciones básicas -----
    if (!persona || !persona.nombre || !persona.mail || !persona.telefono) {
        return respuesta.status(400).json({ mensaje: "Completá todos tus datos" });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        return respuesta.status(400).json({ mensaje: "El carrito está vacío" });
    }

    const ids = productos.map(item => Number(item.id));

    if (ids.some(id => !Number.isInteger(id))) {
        return respuesta.status(400).json({ mensaje: "Producto inválido" });
    }

    let conexionCompra;

    try {
        const [filas] = await db.query("SELECT id, precio FROM producto WHERE id IN (?)", [ids]);

        const precios = {};
        filas.forEach(fila => {
            precios[fila.id] = Number(fila.precio);
        });

        let total = 0;

        for (const item of productos) {
            const precio = precios[Number(item.id)];
            const cantidad = Number(item.cantidad);

            if (precio === undefined || !Number.isInteger(cantidad) || cantidad < 1) {
                return respuesta.status(400).json({ mensaje: "Producto o cantidad inválidos" });
            }

            total += precio * cantidad;
        }

        conexionCompra = await db.getConnection();
        await conexionCompra.beginTransaction();

        const [carrito] = await conexionCompra.query(
            "INSERT INTO carrito (precioTotal) VALUES (?)",
            [total]
        );
        const carritoId = carrito.insertId;

        for (const item of productos) {
            await conexionCompra.query(
                "INSERT INTO carrito_producto (carrito_id, producto_id, cantidad, personalizado, precio) VALUES (?, ?, ?, ?, ?)",
                [carritoId, Number(item.id), Number(item.cantidad), item.personalizado ? 1 : 0, precios[Number(item.id)]]
            );
        }

        await conexionCompra.query(
            "INSERT INTO personas (id_carrito, nombre, mail, telefono) VALUES (?, ?, ?, ?)",
            [carritoId, persona.nombre, persona.mail, persona.telefono]
        );

        await conexionCompra.query(
            "INSERT INTO compras (carrito_id) VALUES (?)",
            [carritoId]
        );

        await conexionCompra.commit();
        respuesta.json({ numero: carritoId });
    } catch (error) {
        if (conexionCompra) {
            await conexionCompra.rollback();
        }

        console.log(error);
        respuesta.status(500).json({ mensaje: "No se pudo registrar la compra. Probá de nuevo." });
    } finally {
        if (conexionCompra) {
            conexionCompra.release();
        }
    }
}

module.exports = {
    crearCompra
};