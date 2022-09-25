import poolSchema from '../schemas/poolSchema.js'

export default function middlewarePool (req, res, next){
    const pool = req.body;

    const checkPool = poolSchema.validate(pool);

    if(checkPool.error) {
        return res.status(422).send('Erro ao enviar pool erro 422')
    }

    next();
}