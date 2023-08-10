
const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient();

async function ExisteEvaluacionCompra(compraId) {
    const evaluacion = await prisma.evaluaciones.findFirst({
        where: {
            compra_id: compraId
        }
    });

    if (evaluacion) {
        return true;
    } else {
        return false;

    }
}

async function EvaluacionCliente(compraid, comentariocliente, calificacionvendedor, clienteid,evaluacionid) {


    await prisma.evaluaciones.update({
        where: {
            // compra_id: compraid
            evaluacion_id: evaluacionid
        },
        data: {
            cliente_id: clienteid,
            calificacion_vendedor: calificacionvendedor,
            comentario_cliente: comentariocliente
        }
    })
}
async function EvaluacionVendedor(compraid, comentariovendedor, calificacioncliente, vendedorid) {


    await prisma.evaluaciones.create({
        data: {
            compra_id: compraid,
            vendedor_id: vendedorid,
            comentario_vendedor: comentariovendedor,
            calificacion_cliente: calificacioncliente
        }
    })
}

async function YaCompletoEvaluacionVendedor(compraid) {
    const evaluacion = await prisma.$queryRaw`SELECT IF(vendedor_id IS NULL, 1, 0) AS is_null FROM Evaluaciones WHERE compra_id = ${compraid};`
    console.log(evaluacion)

    if(evaluacion == 0){
        return true;
    }else{
        return false;
    }
}
async function YaCompletoEvaluacionCliente(compraid) {
  

    const evaluacion = await prisma.evaluaciones.findFirst({
        where:{
            compra_id: compraid
        }
    });

    return evaluacion;

    
}

module.exports = {
    ExisteEvaluacionCompra,
    EvaluacionCliente,
    EvaluacionVendedor,
    YaCompletoEvaluacionVendedor,
    YaCompletoEvaluacionCliente
}