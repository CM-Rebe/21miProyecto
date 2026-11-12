const conexion = require("./conexion");
const db = conexion.promise(); // para usar async/await

async function obtenerProductos(solicitud, respuesta) {
    try {
        const categoriaId = solicitud.query.categoria;
        let consulta = "SELECT id, categoria_id, nombre, precio, imagen FROM producto";
        const parametros = [];

        if (categoriaId) {
            consulta += " WHERE categoria_id = ?";
            parametros.push(categoriaId);
        }

        const [filas] = await db.query(consulta, parametros);
        respuesta.json(filas);
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al obtener los productos" });
    }
}

async function obtenerProducto(solicitud, respuesta) {
    try {
        const [filas] = await db.query(
            "SELECT * FROM producto WHERE id = ?",
            [solicitud.params.id]
        );

        if (filas.length === 0) {
            return respuesta.status(404).json({ mensaje: "Producto no encontrado" });
        }

        respuesta.json(filas[0]);
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al obtener el producto" });
    }
}

async function obtenerCategorias(solicitud, respuesta) {
    try {
        const [filas] = await db.query("SELECT id, nombre FROM categoria");
        respuesta.json(filas);
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al obtener las categorías" });
    }
}

async function obtenerCategoria(solicitud, respuesta) {
    try {
        const [filas] = await db.query(
            "SELECT id, nombre FROM categoria WHERE id = ?",
            [solicitud.params.id]
        );

        if (filas.length === 0) {
            return respuesta.status(404).json({ mensaje: "Categoría no encontrada" });
        }

        respuesta.json(filas[0]);
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al obtener la categoría" });
    }
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    obtenerCategorias,
    obtenerCategoria
};