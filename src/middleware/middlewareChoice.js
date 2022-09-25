import choiceSchema from '../schemas/choiceSchema.js'

export default function middlewareChoice (req, res, next){
    const choice = req.body;

    const checkChoice = choiceSchema.validate(choice);

    if(checkChoice.error) {
        return res.status(422).send('Erro ao enviar choice erro 422')
    }

    next();
}