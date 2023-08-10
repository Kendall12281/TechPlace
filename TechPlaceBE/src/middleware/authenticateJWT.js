const jwt = require("jsonwebtoken");

// function AutenticarRo(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT, (err, decoded) => {
//       if (err) {
//         res.status(401).send("Token invalido.");
//       }

//       // Token is valid
//       else if (!err) {

//         if(decoded.nombre_rol == )

//         req.user = decoded;
//         next();
//       }
//     });
//   } else {
//     res.status(401).send("Se necesitan token de autorizacion.");
//   }
// }

function AutenticarRol(nombreRol) {
  return (req, res, next) => {
    let token = req.headers.authorization;


    if (!token) {
      return res.status(401).json({ message: "No token." });
    }
    
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token invalido" });
      }

      if (decoded.nombre_rol !== nombreRol) {
        return res.status(403).json({ message: "Usuario no posee suficientes permisos" });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = {
  AutenticarRol
};
