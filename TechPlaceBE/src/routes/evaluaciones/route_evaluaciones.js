const { Router } = require("express");
const {ExisteEvaluacionCompra, EvaluacionCliente, EvaluacionVendedor, YaCompletoEvaluacionCliente, YaCompletoEvaluacionVendedor} = require('../../controller/evaluaciones/index');

const router = Router();

router.post("/api/evaluaciones/existeEvaluacion", async (req,res)=>{
    const {compra_id} = req.body;
    const existe = await ExisteEvaluacionCompra(compra_id);
    
    res.send(existe);
})
router.post("/api/evaluaciones/evaluarVendedor", async (req,res)=>{
    const {compra_id, comentario_cliente, calificacion_vendedor,cliente_id, evaluacion_id} = req.body;
    await EvaluacionCliente(compra_id, comentario_cliente, calificacion_vendedor,cliente_id,evaluacion_id);
    
    res.send("Evaluacion agregadada");
})
router.post("/api/evaluaciones/evaluarCliente", async (req,res)=>{
    const {compra_id, comentario_vendedor, calificacion_cliente,cliente_id} = req.body;
    await EvaluacionVendedor(compra_id, comentario_vendedor, calificacion_cliente,cliente_id);
    
    res.send("Evaluacion agregadada");
})

router.post("/api/evaluaciones/YaCompletoEvaluacionCliente", async (req,res)=>{
    const {compra_id} = req.body;
    console.log(res.body)
    const response = await YaCompletoEvaluacionCliente(compra_id);
    console.log(response)

    res.send(response)
    // if(response == true){
    //     res.JSON(true)
    // }else{

    //     res.JSON(false);
    // }
})
router.post("/api/evaluaciones/YaCompletoEvaluacionVendedor", async (req,res)=>{
    const {compra_id} = req.body;

    console.log(res.body)

    const response = await YaCompletoEvaluacionVendedor(compra_id);

    console.log(response)

    if(response == true){
        res.JSON(true)
    }else{

        res.JSON(false);
    }
    
})




module.exports = router;