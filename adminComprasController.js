const conexion = require("./conexion");
const db = conexion.promise(); // para usar async/await

async function obtenerCompras(solicitud, respuesta) {
    try {
        const [compras] = await db.query(`
            SELECT c.carrito_id AS numero, c.fecha, ca.precioTotal AS total,
                   p.nombre, p.mail, p.telefono
            FROM compras c
            JOIN carrito ca ON ca.id = c.carrito_id
            LEFT JOIN personas p ON p.id_carrito = c.carrito_id
            ORDER BY c.fecha DESC, c.id DESC
        `);

        if (compras.length === 0) {
            return respuesta.json([]);
        }

        const numeros = compras.map(compra => compra.numero);

        const [items] = await db.query(`
            SELECT cp.carrito_id, pr.nombre, cp.cantidad, cp.personalizado, cp.precio
            FROM carrito_producto cp
            JOIN producto pr ON pr.id = cp.producto_id
            WHERE cp.carrito_id IN (?)
        `, [numeros]);

        compras.forEach(compra => {
            compra.productos = items.filter(item => item.carrito_id === compra.numero);
        });

        respuesta.json(compras);
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al obtener las compras" });
    }
}

module.exports = {
    obtenerCompras
};