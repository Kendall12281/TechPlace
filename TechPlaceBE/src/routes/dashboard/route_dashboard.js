const { Router } = require("express");

const {
  CantidadComprasDia,
  Top5ProductosCompradosMes,
  Top5VendedoresConMejorEvaluacion,
  Top5VendedoresConPeorEvaluacion,
  ProductoMasVendidoVendedor,
  ClienteMasCompras,
  CalificacionesVendedor
} = require("../../controller/dashboard/operaciones");
const { AutenticarRol } = require("../../middleware/authenticateJWT");
const router = Router();

router.get(
  "/api/dashboard/comprasDia",
  AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const cantidadCompras = await CantidadComprasDia();

    res.send({ cantidad_compras: cantidadCompras });
  }
);

router.get(
  "/api/dashboard/topProductos",
  AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const productos = await Top5ProductosCompradosMes();

    res.send({ top_5_productos_Mes: productos });
  }
);

router.get(
  "/api/dashboard/topVendedores",
  AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const vendedores = await Top5VendedoresConMejorEvaluacion();

    res.send({ top_5_vendedores: vendedores });
  }
);
router.get(
  "/api/dashboard/peorVendedores",
  AutenticarRol("ADMINISTRADOR"),
  async (req, res) => {
    const vendedores = await Top5VendedoresConPeorEvaluacion();

    res.send({ top_peores_5_vendedores: vendedores });
  }
  );
  
  //Verdedor
  router.get(
    "/api/dashboard/vendedor/productoMasVendido",
    AutenticarRol("VENDEDOR"),
    async (req, res) => {
      const producto = await ProductoMasVendidoVendedor(req.user.usuario_id);
  
      res.send({ producto_mas_vendido: producto });
    }
    );

  router.get(
    "/api/dashboard/vendedor/clienteMasCompras",
    AutenticarRol("VENDEDOR"),
    async (req, res) => {
      const cliente = await ClienteMasCompras(req.user.usuario_id);
  
      res.send({ cliente_mas_compras: cliente });
    }
    );
  router.get(
    "/api/dashboard/vendedor/calificaciones",
    AutenticarRol("VENDEDOR"),
    async (req, res) => {
      const calificaciones = await CalificacionesVendedor(req.user.usuario_id);
  
      res.send({ calificaciones: calificaciones });
    }
    );



module.exports = router;
