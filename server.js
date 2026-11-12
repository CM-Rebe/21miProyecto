const express = require("express");
const productosController = require("./productosController");
const app = express();

app.use(express.static("public"));
const conexion = require("./conexion");

app.get("/productos", productosController.obtenerProductos);
app.get("/productos/:id", productosController.obtenerProducto);
app.get("/categorias/:id", productosController.obtenerCategoria); 

app.use((solicitud, respuesta, next) => {
    respuesta.status(404).send("Recurso no encontrado");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
