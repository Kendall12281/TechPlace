const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient();

async function ProductosVendedor(id) {
  try {
    return (productos = await prisma.productos.findMany({
      where: {
        usuario_id: id,
        activado: 1
      },
      include: {
        categorias: true,
      },
    }));
  } catch (error) {
    throw new Error("Error en traer productos por usuario_id");
  } finally {
    await prisma.$disconnect();
  }
}

async function Productos() {
  try {
    return (productos = await prisma.productos.findMany({
      select: {
        usuario_id: false,
        producto_id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        cantidad: true,
        categoria_id: true,
        estado: true,
        fotosproducto: true,
        categorias: true,
      },
      where: {
        activado: 1,
      },
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error en traer productos");
  } finally {
    await prisma.$disconnect();
  }
}
async function DetalleProducto(id) {
  try {
    return (producto = await prisma.productos.findFirst({
      where: {
        producto_id: id,
      },
      include: {
        preguntasproducto: true,
        fotosproducto: true,
        categorias: true,
        usuarios: {
          select: {
            nombre_completo: true,
            identificacion: true,
            numero_telefono: true,
            correo_electronico: true,
          },
        },
        // fotosproducto:true
      },
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error en traer productos por usuario_id");
  } finally {
    await prisma.$disconnect();
  }
}
async function CrearProducto(producto, fotosproducto) {
  try {
    if (fotosproducto != null) {
      const resultado = await prisma.productos.create({
        data: producto,
      });

      for (let foto in fotosproducto) {
        await prisma.fotosproducto.create({
          data: {
            producto_id: resultado.producto_id,
            foto_Base64: fotosproducto[foto].foto_Base64,
          },
        });
      }

      return true;
    } else {
      await prisma.productos.create({
        data: producto,
      });
      return true;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error en crear producto");
  } finally {
    await prisma.$disconnect();
  }
}
async function ModificarProducto(producto, fotosproducto) {
  try {
    if (fotosproducto != null) {
      const resultado = await prisma.productos.update({
        where: {
          producto_id: producto.producto_id,
        },
        data: producto,
      });

      await prisma.fotosproducto.deleteMany({
        where: {
          producto_id: producto.producto_id,
        },
      });

      for (let foto in fotosproducto) {
        await prisma.fotosproducto.create({
          data: {
            producto_id: producto.producto_id,
            foto_Base64: fotosproducto[foto].foto_Base64,
          },
        });
      }

      return true;
    } else {
      await prisma.productos.update({
        where: {
          producto_id: producto.producto_id,
        },
        data: producto,
      });
      return true;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error en crear producto");
  } finally {
    await prisma.$disconnect();
  }
}
async function EliminarProducto(producto_id) {
  try {
    return (producto = await prisma.productos.update({
      where: {
        producto_id: producto_id,
      },
      data: {
        activado: 0,
      },
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar producto");
  } finally {
    await prisma.$disconnect();
  }
}
async function HacerPreguntaCliente(productoid, usuarioid, pregunta) {
  try {
    return await prisma.preguntasproducto.create({
      data:{
        producto_id: productoid,
        usuario_id:usuarioid,
        comentario_usuario:pregunta,
    
      }
    })
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar producto");
  } finally {
    await prisma.$disconnect();
  }
}
async function ResponderPreguntaVendedor(productoid, respuesta) {
  try {
    const res = prisma.preguntasproducto.update({
      where:{
        preguntas_producto_id : productoid
      },
      data:{
        respuesta_vendedor:respuesta
      }
    }) 

    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Error al eliminar producto");
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  ProductosVendedor,
  Productos,
  DetalleProducto,
  EliminarProducto,
  CrearProducto,
  ModificarProducto,
  HacerPreguntaCliente,
  ResponderPreguntaVendedor
};
