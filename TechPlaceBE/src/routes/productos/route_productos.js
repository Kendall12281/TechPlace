const { Router } = require("express");
const {
  ProductosVendedor,
  Productos,
  DetalleProducto,
  CrearProducto,
  EliminarProducto,
  ModificarProducto,
  HacerPreguntaCliente,
  ResponderPreguntaVendedor
} = require("../../controller/productos/CRUD_productos");

const router = Router();

router.get("/api/productos/", async (req, res) => {
  const productos = await Productos();
  
  if (productos != null) {
    res.json(productos);
  } else {
    res.status(404).json({ error: "No hay productos" });
  }
});

router.post("/api/productos/vendedor", async (req, res) => {
  const { usuario_id } = req.body;

  if (usuario_id == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const productos = await ProductosVendedor(usuario_id);

    if (productos != null && Object.keys(productos).length != 0) {
      res.json(productos);
    } else {
      res.status(404).json({ error: "No hay productos" });
    }
  }
});

router.post("/api/productos/detalle", async (req, res) => {
  const { producto_id } = req.body;

  if (producto_id == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const producto = await DetalleProducto(producto_id);

    if (producto != null) {
      res.json(producto);
    } else {
      res.status(404).json({ error: "No hay detalles" });
    }
  }
});
router.post("/api/productos/guardar", async (req, res) => {
  const { producto, fotosproducto } = req.body;

  if (producto == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const resultado = await CrearProducto(producto[0], fotosproducto);

    if (resultado) {
      res.status(201).json({ message: "Producto creado" });
    } else {
      res
        .status(500)
        .json({ message: "Ha ocurrido un error, intente mas tarde" });
    }
  }
});
router.post("/api/productos/modificar", async (req, res) => {
  const { producto, fotosproducto } = req.body;

  if (producto == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const resultado = await ModificarProducto(producto[0], fotosproducto);

    if (resultado) {
      res.status(201).json({ message: "Producto modificado" });
    } else {
      res
        .status(500)
        .json({ message: "Ha ocurrido un error, intente mas tarde" });
    }
  }
});
router.post("/api/productos/eliminar", async (req, res) => {
  const { producto_id } = req.body;

  if (producto_id == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const resultado = await EliminarProducto(producto_id);

    if (resultado) {
      res.status(201).json({ message: "Producto eliminado" });
    } else {
      res
        .status(500)
        .json({ message: "Ha ocurrido un error, intente mas tarde" });
    }
  }
});
router.post("/api/productos/hacerPreguntaCliente", async (req, res) => {
  const { producto_id,usuario_id,pregunta } = req.body;

  if (producto_id == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const resultado = await HacerPreguntaCliente(producto_id,usuario_id,pregunta);

    if (resultado) {
      res.status(201).json({ message: "Pregunta realizada" });
    } else {
      res
        .status(500)
        .json({ message: "Ha ocurrido un error, intente mas tarde" });
    }
  }
});
router.post("/api/productos/responderPreguntaVendedor", async (req, res) => {
  const { preguntas_producto_id,respuesta } = req.body;

  if (preguntas_producto_id == null || respuesta == null) {
    res.status(500).json({ message: "JSON vacio o inválido" });
  } else {
    const resultado = await ResponderPreguntaVendedor(preguntas_producto_id,respuesta);

    if (resultado) {
      res.status(201).json({ message: "Respuesta realizada" });
    } else {
      res
        .status(500)
        .json({ message: "Ha ocurrido un error, intente mas tarde" });
    }
  }
});

module.exports = router;
