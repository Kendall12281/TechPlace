const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient();

async function CantidadComprasDia() {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const comprasDia = await prisma.compras.findMany({
      where: {
        fecha_compra: new Date(formattedDate),
      },
    });

    return Object.keys(comprasDia).length;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function Top5ProductosCompradosMes() {
  try {
    let currentDate = new Date();

    const productos =
      await prisma.$queryRaw`SELECT p.producto_id, p.nombre, p.descripcion, p.precio, SUM(dc.cantidad) AS total_cantidad_vendidos_mes FROM Productos p JOIN DetallesCompra dc ON p.producto_id = dc.producto_id JOIN Compras c ON dc.compra_id = c.compra_id WHERE MONTH(c.fecha_compra) = ${
        currentDate.getMonth() + 1
      } AND YEAR(c.fecha_compra) = ${currentDate.getFullYear()} GROUP BY p.producto_id, p.nombre ORDER BY total_cantidad_vendidos_mes DESC LIMIT 5`;

    return productos;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function Top5VendedoresConMejorEvaluacion() {
  try {
    let currentDate = new Date();

    const vendedores =
      await prisma.$queryRaw`SELECT e.vendedor_id, u.nombre_completo, AVG(e.calificacion_vendedor) AS avg_rating FROM Evaluaciones e JOIN Usuarios u ON e.vendedor_id = u.usuario_id GROUP BY e.vendedor_id, u.nombre_completo ORDER BY avg_rating DESC LIMIT 5;`;

    return vendedores;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function Top5VendedoresConPeorEvaluacion() {
  try {
    let currentDate = new Date();

    const vendedores =
      await prisma.$queryRaw`SELECT e.vendedor_id, u.nombre_completo, AVG(e.calificacion_vendedor) AS avg_rating FROM Evaluaciones e JOIN Usuarios u ON e.vendedor_id = u.usuario_id GROUP BY e.vendedor_id, u.nombre_completo ORDER BY avg_rating ASC LIMIT 5;`;

    return vendedores;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

//Vededores

async function ProductoMasVendidoVendedor(idVendedor) {
  try {

    const producto =
      await prisma.$queryRaw`SELECT  p.producto_id, p.nombre, p.descripcion, p.precio, SUM(dc.cantidad) AS total_vendido FROM Productos p JOIN DetallesCompra dc ON p.producto_id = dc.producto_id JOIN Compras c ON dc.compra_id = c.compra_id WHERE p.usuario_id = ${idVendedor} GROUP BY p.producto_id, p.nombre ORDER BY total_vendido DESC LIMIT 1`;

    return producto;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function ClienteMasCompras(idVendedor) {
  try {

    var cliente =
      await prisma.$queryRaw`SELECT u.usuario_id, u.nombre_completo, SUM(dc.cantidad) AS total_cantidad FROM Usuarios u JOIN Compras c ON u.usuario_id = c.usuario_id JOIN DetallesCompra dc ON c.compra_id = dc.compra_id JOIN Productos p ON dc.producto_id = p.producto_id WHERE p.usuario_id = ${idVendedor} GROUP BY u.usuario_id, u.nombre_completo ORDER BY total_cantidad DESC`;

    return cliente;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
async function CalificacionesVendedor(idVendedor) {
  try {

    var calificaciones =
      await prisma.$queryRaw`SELECT c.calificacion_vendedor, COUNT(e.calificacion_vendedor) AS count FROM (SELECT 1 AS calificacion_vendedor UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) AS c LEFT JOIN Evaluaciones e ON c.calificacion_vendedor = e.calificacion_vendedor AND e.vendedor_id = ${idVendedor} GROUP BY c.calificacion_vendedor ORDER BY c.calificacion_vendedor;`;

      for(var calificacion in calificaciones){
        calificaciones[calificacion].calificacion_vendedor = Number(calificaciones[calificacion].calificacion_vendedor);
        calificaciones[calificacion].count = Number(calificaciones[calificacion].count);
      }
      console.log(calificaciones)
    return calificaciones;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  CantidadComprasDia,
  Top5ProductosCompradosMes,
  Top5VendedoresConMejorEvaluacion,
  Top5VendedoresConPeorEvaluacion,
  ProductoMasVendidoVendedor,
  ClienteMasCompras,
  CalificacionesVendedor
};
