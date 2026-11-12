const crypto = require("crypto");
const conexion = require("./conexion");
const db = conexion.promise(); // para usar async/await

const sesiones = []; // guarda las sesiones abiertas

function obtenerToken(solicitud) {
    const cookies = solicitud.headers.cookie || "";
    const parte = cookies.split("; ").find(cookie => cookie.startsWith("sesionAdmin="));
    return parte ? parte.split("=")[1] : null;
}

async function login(solicitud, respuesta) {
    const { nombre, contrasena } = solicitud.body;

    if (!nombre || !contrasena) {
        return respuesta.status(400).json({ mensaje: "Completá usuario y contraseña" });
    }

    try {
        const [filas] = await db.query("SELECT contrasena FROM admin WHERE nombre = ?", [nombre]);

        if (filas.length === 0) {
            return respuesta.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

        const [sal, hash] = filas[0].contrasena.split(":");
        const calculado = crypto.scryptSync(contrasena, sal, 64).toString("hex");

        if (calculado !== hash) {
            return respuesta.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        sesiones.push(token);

        respuesta.setHeader("Set-Cookie", `sesionAdmin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=7200`);
        respuesta.json({ ok: true });
    } catch (error) {
        console.log(error);
        respuesta.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
}

function logout(solicitud, respuesta) {
    const posicion = sesiones.indexOf(obtenerToken(solicitud));

    if (posicion !== -1) {
        sesiones.splice(posicion, 1);
    }

    respuesta.setHeader("Set-Cookie", "sesionAdmin=; Path=/; Max-Age=0");
    respuesta.json({ ok: true });
}

// Si no hay sesión la página no existe
function soloAdmin(solicitud, respuesta, next) {
    if (sesiones.includes(obtenerToken(solicitud))) {
        return next();
    }

    respuesta.status(404).send("Recurso no encontrado");
}

module.exports = {
    login,
    logout,
    soloAdmin
};