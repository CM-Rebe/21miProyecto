const express = require("express");

const app = express();

app.use(express.static("public"));


const productos = [
    {
        id: 1,
        nombre: "Agenda Anual 2027 Harry Potter",
        precio: 0,
        imagen: "imagenes/imagen 1.png"
    },
    {
        id: 2,
        nombre: "Vinilo Sobrero Seleccionador Harry Potter",
        precio: 0,
        imagen: "imagenes/imagen 2.png"
    },
    {
        id: 3,
        nombre: "Libro Para Colorear",
        precio: 0,
        imagen: "imagenes/imagen 3.png"
    },
    {
        id: 4,
        nombre: "Libro Bambi",
        precio: 0,
        imagen: "imagenes/imagen 4.png"
    },
    {
        id: 5,
        nombre: "Agenda Misa Amane",
        precio: 0,
        imagen: "imagenes/imagen 5.png"
    }
];


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

app.use((solicitud, respuesta, next) => {
    respuesta.status(404).send('Recurso no encontrado');
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});