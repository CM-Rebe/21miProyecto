const crypto = require("crypto");
const conexion = require("./conexion");

const [, , nombre, clave] = process.argv;

if (!nombre || !clave) {
    console.log("Uso: node hashearAdmin.js usuario contraseña");
    process.exit();
}

const sal = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(clave, sal, 64).toString("hex");

conexion.query(
    "UPDATE admin SET contrasena = ? WHERE nombre = ?",
    [sal + ":" + hash, nombre],
    (error, resultado) => {
        if (error) {
            console.log(error);
        } else if (resultado.affectedRows === 0) {
            console.log("No existe ese usuario");
        } else {
            console.log("Contraseña actualizada");
        }
        process.exit();
    }
);