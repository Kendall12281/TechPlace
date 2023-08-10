const { Router } = require("express");
const {
  IniciarSesion,
  ObtenerUsuario,
} = require("../../controller/usuarios/iniciar_sesion");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/api/iniciarSesion", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;


  const usuario = await ObtenerUsuario(correo_electronico);

  if (usuario && usuario.desactivado != true) {
    const iniciarSesion = await IniciarSesion(usuario.contrasena, contrasena);
    if (iniciarSesion) {
      // delete usuario.contrasena;
      const jwt = await GenerarJWT(usuario);
      res.json({jwt, usuario});
    } else {
        res.status(401).json({ error: 'Contraseña invalida' });
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

function GenerarJWT(user) {
  // Generar a JWT token
  //usuario es un json con la informacion del usuario y sus accesos
  return token = jwt.sign(user, process.env.JWT);
  // return (token = jwt.sign(user, process.env.JWT, { expiresIn: "1h" }));
}
module.exports = router;
