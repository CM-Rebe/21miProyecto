const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // En caso de usar Workbench poner la contraseña (esta info no la suban a github)
    database: "tienda_libelula"
});

pool.getConnection((error, conexion) => {
    if (error) {
        console.log("Error de conexión");
        return;
    }

    console.log("Conectado a MySQL");
    conexion.release();
});

module.exports = pool;