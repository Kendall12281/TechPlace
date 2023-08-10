import { PrismaClient } from "@prisma/client";
//seed
import { roles } from "./seeds/roles";
import { usuarios } from "./seeds/usuarios";
import { categorias } from "./seeds/categorias";
import { productos } from "./seeds/productos";
import { direcciones } from "./seeds/direcciones";
import { metodos_de_pago } from "./seeds/metodos_de_pago";
import { estado_pedidos } from "./seeds/estado_pedidos";
import { detalles_compras } from "./seeds/detalles_compras";
import { compras } from "./seeds/compras";
import { fotosProducto } from "./seeds/fotosProducto";
import { evaluaciones } from "./seeds/evaluaciones";
import { preguntasProducto } from "./seeds/preguntasProducto";

const prisma = new PrismaClient();

//orden
/**
 roles -> Usuarios
 
 categorias -> productos
 
 direcciones -> metodos_de_pago -> estado_pedidos -> detalles_compras -> compras

 */

export async function main() {
  //roles
  await prisma.roles.createMany({
    data: roles,
  });

  //usuarios
  await prisma.usuarios.createMany({
    data: usuarios,
  });

  //categorias
  await prisma.categorias.createMany({
    data: categorias,
  });

  //productos
  await prisma.productos.createMany({
    data: productos,
  });


  //direcciones
  await prisma.direcciones.createMany({
    data: direcciones,
  });

  //metodos de pago
  await prisma.metodospago.createMany({
    data: metodos_de_pago,
  });

//estado pedidos
await prisma.estadopedido.createMany({
  data: estado_pedidos,
});

//compras
await prisma.compras.createMany({
  data: compras,
});

//detalles compras
await prisma.detallescompra.createMany({
  data: detalles_compras,
});

//fotos productos
await prisma.fotosproducto.createMany({
  data: fotosProducto,
});
//Evaluaciones productos
await prisma.evaluaciones.createMany({
  data: evaluaciones,
});

//preguntas  productos
await prisma.preguntasproducto.createMany({
  data: preguntasProducto,
});

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
