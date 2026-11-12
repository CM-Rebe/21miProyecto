const conexion = require("./conexion");
const db = conexion.promise(); // para usar async/await

function datosValidos(cuerpo) {
    const { categoria_id, nombre, precio } = cuerpo;

    return nombre && nombre.trim() !== ""
        && Number(precio) > 0
        && Number.isInteger(Number(categoria_id))
        && Number(categoria_id) > 0;
}

async function crearProducto(solicitud, respuesta) {
    if (!datosValidos(solicitud.body)) {
        return respuesta.status(400).json({ mensaje: "Completá nombre, categoría y un precio válido" });
    }

    const { categoria_id, nombre, descripcion, precio, imagen } = solicitud.body;

    try {
        const [resultado] = await db.query(
            "INSERT INTO producto (categoria_id, nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?, ?)",
            [categoria_id, nombre.trim(), descripcion || "", precio, imagen || ""]
        );

        respuesta.json({ id: resultado.insertId });
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "No se pudo añadir el producto" });
    }
}

async function editarProducto(solicitud, respuesta) {
    if (!datosValidos(solicitud.body)) {
        return respuesta.status(400).json({ mensaje: "Completá nombre, categoría y un precio válido" });
    }

    const { categoria_id, nombre, descripcion, precio, imagen } = solicitud.body;

    try {
        const [resultado] = await db.query(
            "UPDATE producto SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?",
            [categoria_id, nombre.trim(), descripcion || "", precio, imagen || "", solicitud.params.id]
        );

        if (resultado.affectedRows === 0) {
            return respuesta.status(404).json({ mensaje: "Producto no encontrado" });
        }

        respuesta.json({ ok: true });
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "No se pudo editar el producto" });
    }
}

async function borrarProducto(solicitud, respuesta) {
    try {
        await db.query("DELETE FROM producto WHERE id = ?", [solicitud.params.id]);
        respuesta.json({ ok: true });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return respuesta.status(409).json({ mensaje: "No se puede borrar: este producto ya fue comprado" });
        }

        console.log(error);
        respuesta.status(500).json({ mensaje: "No se pudo borrar el producto" });
    }
}

module.exports = {
    crearProducto,
    editarProducto,
    borrarProducto
};