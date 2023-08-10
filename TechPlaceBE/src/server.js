const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

//informacion DB

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;

    this.app.use(bodyParser.json({ limit: "10mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

    this.rutas = require("./routes/routes");

    this.app.use(cors());
    this.app.use(express.json());
    this.router();
  }

  router() {
    const objetoRutas = new this.rutas();
    this.app.use(objetoRutas.usuarios);
    this.app.use(objetoRutas.sesion);
    this.app.use(objetoRutas.productos);
    this.app.use(objetoRutas.pedidos);
    this.app.use(objetoRutas.dashboard);
    this.app.use(objetoRutas.evaluaciones);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Server running http://localhost:${this.port}/api/ on port`,
        this.port
      );
    });
  }
}

module.exports = Server;
