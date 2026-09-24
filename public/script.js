const contenedor = document.querySelector("#productos");

fetch("/productos")
    .then(respuesta => respuesta.json())
    .then(datos => {

        datos.forEach(producto => {
            contenedor.innerHTML += `
            <div class="categoria-card">
                <img class="superImagen" src="${producto.imagen}" alt="${producto.nombre}">
                <h3 class="categoria-nombre">${producto.nombre}</h3> 
                <p class="categoria-desc">Precio: $${producto.precio}</p>
                <a class="categoria-btn" href="/productos/${producto.id}">Ver producto</a>
             </div>
            `;
        });

    });