const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient();

async function PedidosCliente(id) {
  try {
    return (pedidos = await prisma.compras.findMany({
      where: {
        usuario_id: id,
      },
      include: {
        estadopedido: true,
        metodospago: true,
        direcciones: true,
        usuarios: {
          select: {
            nombre_completo: true,
            identificacion: true,
            correo_electronico: true,
          },
        },
        detallescompra: {
          include: {
            productos: true,
            usuarios: {
              select: {
                nombre_completo: true,
                identificacion: true,
                correo_electronico: true,
              },
            },
          },
        },
      },
    }));
  } catch (error) {
    console.log(new Error("**Error en traer pedidos del cliente**"));
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

async function DetallePedido(id) {
  try {
    return (pedidos = await prisma.compras.findFirst({
      where: {
        compra_id: id,
      },
      include: {
        estadopedido: true,
        direcciones: true,
        metodospago: true,
        usuarios: {
          select: {
            nombre_completo: true,
            identificacion: true,
            correo_electronico: true,
          },
        },
        detallescompra: {
          include: {
            productos: true,
          },
        },
      },
    }));
  } catch (error) {
    console.log(new Error("**Error en traer pedidos del cliente**"));
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function CrearPedido(compra, detallescompra) {
  try {
    const compraRegistrada = await prisma.compras.create({
      data: {
        usuario_id: compra.usuario_id,
        direccion_id: compra.direccion_id,
        metodo_pago_id: compra.metodo_pago_id,
        estado_pedido_id: 1,
      },
    });


    for (let detalle in detallescompra) {
      await prisma.detallescompra.create({
        data: {
          usuario_id: compraRegistrada.usuario_id,
          compra_id: compraRegistrada.compra_id,
          producto_id: detallescompra[detalle].producto,
          cantidad: detallescompra[detalle].cantidad,
          subtotal: detallescompra[detalle].subtotal,
          impuesto: detallescompra[detalle].impuesto,
          total: detallescompra[detalle].total,
        },
      });
    }

    //Restar productos al stock
    for (let detalle in detallescompra) {
      await prisma.productos.update({
        where: {
          producto_id: detallescompra[detalle].producto,
        },
        data: {
          cantidad: {
            decrement: detallescompra[detalle].cantidad,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    console.log(new Error("Error al crear compra"));
  } finally {
    await prisma.$disconnect();
  }
}


async function PedidosVendedor(usuarioId) {
  const compras = await prisma.compras.findMany({
    include: {
      direcciones: true,
      metodospago: true,
      estadopedido: true,
      detallescompra: {
        include: {
          productos: true,
          usuarios: true,
        },
      },
    },
  });

  const comprasFiltered = compras.filter((compra) =>
    compra.detallescompra.some(
      (detalle) => detalle.productos.usuario_id === usuarioId
    )
  );

  const uniqueCompras = comprasFiltered.reduce((acc, current) => {
    const x = acc.find((item) => item.compra_id === current.compra_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return uniqueCompras;
}

async function CambiarEstado(compra_id, estado_id) {
  // var numeroEstado;

  // switch(nombreEstado.toLowerCase()){
  //   case nombreEstado == "entregado":
  //     numeroEstado = 3
  //     break;

  //   default:
  //     numeroEstado = 1
  //     break;
  // }

  const cambiarEstado = await prisma.compras.update({
    where: {
      compra_id: compra_id,
    },
    data: {
      estado_pedido_id: estado_id,
    },
  });

  console.log(cambiarEstado);
  return cambiarEstado;
}

module.exports = {
  PedidosCliente,
  DetallePedido,
  CrearPedido,
  PedidosVendedor,
  CambiarEstado,
};
