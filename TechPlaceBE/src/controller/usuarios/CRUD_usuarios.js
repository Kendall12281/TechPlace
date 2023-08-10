const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient();

const bcrypt = require("bcrypt");



async function CrearUsuario(data) {
  try {
    const existe = await ExisteCorreoElectronico(data.correo_electronico);
    if (!existe) {
      const usuario = await prisma.usuarios.create({
        data: {
          nombre_completo: data.nombre_completo,
          identificacion: data.identificacion,
          numero_telefono: data.numero_telefono,
          correo_electronico: data.correo_electronico,
          // contrasena: await EncriptarContrasena(data.contrasena),
          contrasena: await data.contrasena,
          rol_id: await ObtenerRolid(data.rolNombre),
        },
      });
      // delete usuario.contrasena;
      usuario.nombre_rol = await NombreRol(usuario.rol_id);
      delete usuario.rol_id;
      return usuario;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error en crear usuario");
  } finally {
    await prisma.$disconnect();
  }
}

async function EncriptarContrasena(contrasena) {
  return await bcrypt.hash(contrasena, 10);
}

async function ExisteCorreoElectronico(correo) {
  const usuario = await prisma.usuarios.findFirst({
    where: {
      correo_electronico: correo,
    },
  });

  if (usuario != null) {
    return true;
  } else {
    return null;
  }
}

async function ObtenerRolid(rolNombre) {
  const rol = await prisma.roles.findFirst({
    where: {
      nombre_rol: rolNombre,
    },
  });

  console.log(rol);
  if (rol) {
    return rol.rol_id;
  } else {
    return null;
  }
}

async function NombreRol(idRol) {
  try {
    const rol = await prisma.roles.findFirst({
      where: {
        rol_id: idRol,
      },
    });

    return rol.nombre_rol;
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}
async function ObtenerUsuarioPorId(idUsuario) {
  try {
    const usuario = await prisma.usuarios.findFirst({
      where: {
        usuario_id: idUsuario,
      },
    });

    if (usuario) {
      const rol = await NombreRol(usuario.rol_id);
      // delete usuario.contrasena;
      usuario.nombre_rol = rol;
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
async function ObtenerTodosLosUsuarios() {
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: {
        roles: true,
        direcciones: {
          where: {
            eliminado: false
          }
        },
        metodospago: {
          where:{
            eliminado:false
          }
        },
      },
    });
    return usuarios;
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}
//Mantenimiento
async function MantenimientoUsuario(data) {
  try {
    if (data.usuario_id != null) {
      //Si es 0 es nuevo
      if (data.usuario_id == 0) {

        const existeUsuario = await ExisteCorreoElectronico(data.correo_electronico);
        //ver usuario si ya existe
        if(existeUsuario){
            return false
        }
        //Si tiene listas es un usuario tipo cliente
        //crear usuario
        const usuario = await prisma.usuarios.create({
          data: {
            nombre_completo: data.nombre_completo,
            identificacion: data.identificacion,
            numero_telefono: data.numero_telefono,
            correo_electronico: data.correo_electronico,
            // contrasena: await EncriptarContrasena(data.contrasena),
            contrasena: await data.contrasena,
            rol_id: await ObtenerRolid(data.rolNombre),
           
          },
        });

        //Crear direcciones
        if (data.lista_direccion) {
          for (direccion in data.lista_direccion) {
            await prisma.direcciones.create({
              data: {
                usuario_id: usuario.usuario_id,
                provincia: data.lista_direccion[direccion].provincia,
                provinciaid: Number(data.lista_direccion[direccion].provinciaid),
                canton: data.lista_direccion[direccion].canton,
                cantonid: Number(data.lista_direccion[direccion].cantonid),
                distrito: data.lista_direccion[direccion].distrito,
                distritoid: Number(data.lista_direccion[direccion].distritoid),
                direccion_exacta: data.lista_direccion[direccion].direccion_exacta,
                codigo_postal: data.lista_direccion[direccion].codigo_postal,
                telefono: data.lista_direccion[direccion].telefono,
              },
            });
          }
        }

        //crear tipos de pago
        if (data.lista_metodo_pago) {
          for (tipoPago in data.lista_metodo_pago) {
            await prisma.metodospago.create({
              data: {
                usuario_id: usuario.usuario_id,
                tipo_pago: data.lista_metodo_pago[tipoPago].tipo_pago,
                proveedor: data.lista_metodo_pago[tipoPago].proveedor,
                numero_cuenta: data.lista_metodo_pago[tipoPago].numero_cuenta,
                fecha_expiracion: data.lista_metodo_pago[tipoPago].fecha_expiracion,
              },
            });
          }
        }

        return "Usuario agregado con exito";
      } else {
        //actualizar usuario
        const usuario = await prisma.usuarios.update({
          where: {
            usuario_id: data.usuario_id,
          },
          data: {
            nombre_completo: data.nombre_completo,
            identificacion: data.identificacion,
            numero_telefono: data.numero_telefono,
            correo_electronico: data.correo_electronico,
            contrasena: data.contrasena,
            rol_id: await ObtenerRolid(data.rolNombre),
            desactivado:data.desactivado
          },
        });

        //Actualizar direcciones
        if (data.lista_direccion) {
          for (direccion in data.lista_direccion) {
            if(data.lista_direccion[direccion].es_dinamico){
              await prisma.direcciones.create({
                data: {
                  usuario_id: usuario.usuario_id,
                  provincia: data.lista_direccion[direccion].provincia,
                  provinciaid: Number(data.lista_direccion[direccion].provinciaid),
                  canton: data.lista_direccion[direccion].canton,
                  cantonid: Number(data.lista_direccion[direccion].cantonid),
                  distrito: data.lista_direccion[direccion].distrito,
                  distritoid: Number(data.lista_direccion[direccion].distritoid),
                  direccion_exacta: data.lista_direccion[direccion].direccion_exacta,
                  codigo_postal: data.lista_direccion[direccion].codigo_postal,
                  telefono: data.lista_direccion[direccion].telefono,
                },
              });
            }
            else{
              if(data.lista_direccion[direccion].eliminado){
                await prisma.direcciones.update({
                  where: {
                    direccion_id: data.lista_direccion[direccion].direccion_id,
                  },
                  data: {
                    provincia: data.lista_direccion[direccion].provincia,
                    provinciaid: Number(data.lista_direccion[direccion].provinciaid),
                    canton: data.lista_direccion[direccion].canton,
                    cantonid: Number(data.lista_direccion[direccion].cantonid),
                    distrito: data.lista_direccion[direccion].distrito,
                    distritoid: Number(data.lista_direccion[direccion].distritoid),
                    direccion_exacta: data.lista_direccion[direccion].direccion_exacta,
                    codigo_postal: data.lista_direccion[direccion].codigo_postal,
                    telefono: data.lista_direccion[direccion].telefono,
                    eliminado: data.lista_direccion[direccion].eliminado,
                  },
                });
              }
            }
          }
        }

        //actualizar tipos de pago
        if (data.lista_metodo_pago) {
          for (tipoPago in data.lista_metodo_pago) {
            if(data.lista_metodo_pago[tipoPago].es_dinamico){
              await prisma.metodospago.create({
                data: {
                  usuario_id: usuario.usuario_id,
                  tipo_pago: data.lista_metodo_pago[tipoPago].tipo_pago,
                  proveedor: data.lista_metodo_pago[tipoPago].proveedor,
                  numero_cuenta: data.lista_metodo_pago[tipoPago].numero_cuenta,
                  fecha_expiracion: data.lista_metodo_pago[tipoPago].fecha_expiracion,
                },
              });
            }else{
              if(data.lista_metodo_pago[tipoPago].eliminado){
                await prisma.metodospago.update({
                  where: {
                    metodo_pago_id: data.lista_metodo_pago[tipoPago].metodo_pago_id,
                  },
                  data: {
                    tipo_pago: data.lista_metodo_pago[tipoPago].tipo_pago,
                    proveedor: data.lista_metodo_pago[tipoPago].proveedor,
                    numero_cuenta: data.lista_metodo_pago[tipoPago].numero_cuenta,
                    fecha_expiracion: data.lista_metodo_pago[tipoPago].fecha_expiracion,
                    eliminado: data.lista_metodo_pago[tipoPago].eliminado,
                  },
                });
              }
            }     
          }
        }
        return "Usuario actualizado con exito";
      }
    }else{
      return "Debe ingresar campo usuario_id"
    }
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect();
  }
}
async function MantenimientoCrearUsuario(usuario) {
  try {
    await prisma.usuarios.create({
      data: usuario,
    });
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}
async function MantenimientoActualizarUsuario(usuario) {
  try {
    await prisma.usuarios.update({
      where: {
        correo_electronico: usuario.correo_electronico,
      },
      data: data,
    });
  } catch (error) {
    throw new Error("Error en obtener usuario");
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  CrearUsuario,
  ObtenerUsuarioPorId,
  ObtenerTodosLosUsuarios,
  MantenimientoUsuario,
};
