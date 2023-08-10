class rutas {
  constructor() {
    this.usuarios = require("./usuarios/route_usuarios");
    this.sesion = require("./Iniciar_sesion/route_sesion");
    this.productos = require("./productos/route_productos");
    this.pedidos = require("./pedidos/route_pedidos");
    this.dashboard = require("./dashboard/route_dashboard");
    this.evaluaciones = require("./evaluaciones/route_evaluaciones");
  }
}

module.exports = rutas;
