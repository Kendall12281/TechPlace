const Prisma = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new Prisma.PrismaClient();

async function IniciarSesion(usuarioContrasena, contrasena) {
  // const resultado = await CompararContrasena(contrasena, usuarioContrasena);
  const resultado = contrasena.trim() == usuarioContrasena.trim();

  if (resultado) {
    return true;
  } else {
    return false;
  }
}

async function ObtenerUsuario(correo) {
  try {
    const usuario = await prisma.usuarios.findFirst({
      where: {
        correo_electronico: correo,
      },
    });

    if (usuario) {
      const rol = await NombreRol(usuario.rol_id);
      usuario.nombre_rol = rol.nombre_rol;
      return usuario;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}

async function CompararContrasena(contrasena, contrasenaEncriptada) {
  try {
    const result = await bcrypt.compare(contrasena, contrasenaEncriptada);
    return result;
  } catch (error) {
    return false;
  }
}

async function NombreRol(idRol) {
  try {
    return (rol = await prisma.roles.findFirst({
      where: {
        rol_id: idRol,
      },
    }));

    return rol.nombre_rol;
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  IniciarSesion,
  ObtenerUsuario,
};
