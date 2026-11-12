const express = require("express");
const path = require("path");
const productosController = require("./productosController");
const comprasController = require("./comprasController");
const adminController = require("./adminController");
const adminProductosController = require("./adminProductosController");
const adminComprasController = require("./adminComprasController");
const app = express();

app.use(express.json()); // para leer los datos JSON que manda el navegador
app.use(express.static("public"));
const conexion = require("./conexion");

app.get("/productos", productosController.obtenerProductos);
app.get("/productos/:id", productosController.obtenerProducto);
app.get("/categorias", productosController.obtenerCategorias);
app.get("/categorias/:id", productosController.obtenerCategoria);
app.post("/compras", comprasController.crearCompra);

const RUTA_SECRETA = "/sesion-kita";

app.get(RUTA_SECRETA, (solicitud, respuesta) => {
    respuesta.sendFile(path.join(__dirname, "privado", "login.html"));
});
app.post(RUTA_SECRETA, adminController.login);
app.post(RUTA_SECRETA + "/salir", adminController.logout);
app.get(RUTA_SECRETA + "/panel", adminController.soloAdmin, (solicitud, respuesta) => {
    respuesta.sendFile(path.join(__dirname, "privado", "panel.html"));
});

// Productos (solo con sesión de admin)
app.post(RUTA_SECRETA + "/productos", adminController.soloAdmin, adminProductosController.crearProducto);
app.put(RUTA_SECRETA + "/productos/:id", adminController.soloAdmin, adminProductosController.editarProducto);
app.delete(RUTA_SECRETA + "/productos/:id", adminController.soloAdmin, adminProductosController.borrarProducto);

// Compras (solo con sesión de admin)
app.get(RUTA_SECRETA + "/compras", adminController.soloAdmin, adminComprasController.obtenerCompras);

app.use((solicitud, respuesta, next) => {
    respuesta.status(404).send("Recurso no encontrado");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});