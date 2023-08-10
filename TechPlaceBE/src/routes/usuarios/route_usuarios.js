const { Router } = require("express");
const {
  CrearUsuario,
  ObtenerUsuarioPorId,
  ObtenerTodosLosUsuarios,
  MantenimientoUsuario,
} = require("../../controller/usuarios/CRUD_usuarios");
const jwt = require("jsonwebtoken");
const { AutenticarRol } = require("../../middleware/authenticateJWT");

const router = Router();

router.post("/api/usuarios/crearUsuario", async (req, res) => {
  const data = req.body;

  const user = await CrearUsuario(data);
  if (user) {
    const jwt = await GenerarJWT(user);
    res.status(200).send({ jwt, user });
  } else {
    res.status(409).send("Usuario ya existe");
  }
});
router.post(
  "/api/usuarios/obtenerUsuario",
  AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const data = req.body;

    if (data != null) {
      const user = await ObtenerUsuarioPorId(data.usuario_id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    } else {
      res.status(403).send("Debe ingresar datos");
    }
  }
);
router.get(
  "/api/usuarios/todos",
  // AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const usuarios = await ObtenerTodosLosUsuarios();

    res.send(usuarios);
  }
);
router.post(
  "/api/usuarios/mantenimiento",
  async (req, res) => {
    const data = req.body;

    if (Object.keys(data).length > 0) {
      console.log(data)
      const respuesta = await MantenimientoUsuario(data);
      if (respuesta == false) {
        res.status(409).send("Usuario que intenta crear ya existe");
      } else {
        res.status(200).send(respuesta);
      }

    } else {
      res.status(403).send("Debe ingresar datos");
    }
  }
);

function GenerarJWT(user) {
  // Generar a JWT token
  //usuario es un json con la informacion del usuario y sus accesos
  return (token = jwt.sign(user, process.env.JWT));
  // return (token = jwt.sign(user, process.env.JWT, { expiresIn: "1h" }));
}

module.exports = router;
