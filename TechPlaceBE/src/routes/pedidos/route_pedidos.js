const { Router } = require("express");
const {PedidosCliente, DetallePedido, CrearPedido, PedidosVendedor, CambiarEstado} = require('../../controller/pedidos/CRUD_pedidos');

const router = Router();

router.post("/api/pedidos/cliente", async (req,res)=>{
    const {usuario_id} = req.body;
    const pedidos = await PedidosCliente(usuario_id);
    
    if(pedidos != null && Object.keys(pedidos).length != 0){
        res.json(pedidos);
    }else{
        res.status(404).json({ error: 'No hay pedidos' });
    }
})
router.post("/api/pedidos/vendedor", async (req,res)=>{
    const {usuario_id} = req.body;
    const pedidos = await PedidosVendedor(usuario_id);
    
    if(pedidos != null && Object.keys(pedidos).length != 0){
        res.json(pedidos);
    }else{
        res.status(404).json({ error: 'No hay pedidos' });
    }
})
router.post("/api/pedidos/detalle", async (req,res)=>{
    const {compra_id} = req.body;
    const pedido = await DetallePedido(compra_id);
    
    if(pedido != null && Object.keys(pedido).length != 0){
        res.json(pedido);
    }else{
        res.status(404).json({ error: 'No hay pedidos' });
    }
})
router.post("/api/pedidos/guardar", async (req,res)=>{
    const {detalle_compra} = req.body;
        
    if(req.body != null && detalle_compra != null){
        const pedido = await CrearPedido(req.body,detalle_compra);
        console.log(pedido)
        res.status(200).json({ message: "Compra guardada con exito" });
    }else{
        res.status(500).json({ message: "JSON vacio o inválido" });
    }
})
router.post("/api/pedidos/actualizarEstado", async (req,res)=>{
    const {compra_id, estado_id} = req.body;
    
    
    if(compra_id != null && estado_id != null){
        await CambiarEstado(compra_id,estado_id);
        res.status(200).json({ message: "Compra actualizada con exito" });
    }else{
        res.status(500).json({ message: "JSON vacio o inválido" });
    }
})


module.exports = router;