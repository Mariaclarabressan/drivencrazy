import dayjs from 'dayjs';
import db from '../mongo/db.js';
import { ObjectId} from 'mongodb';


export async function postChoice(req,res){
    const {title, poolId} = req.body;
    const choice = req.body;

    try {
        const takeId = ObjectId(poolId);

        const selectedPool = await db.collection('pools').findOne(({_id: takeId}));
        
        if(!selectedPool) {
            return res.status(404).send('Enquete não existe')
        }

        const poolTime = selectedPool.expireAt;

        const choiceDate = dayjs().format('YYYY-MM-D hh:mm');

        if(choiceDate > poolTime) {
            return res.status(404).send('Essa enquete já foi tirar do ar')
        }

        const choicesUsers = await db.collection('choices').findOne({title:title});

        if(choicesUsers){
            return res.status(409).send('Esse título já existe');
        }

        await db.collection('choices').insertOne({...choice, vote:0});

        return res.status(201).send('Opção de voto criada com sucesso');


    } catch (error) {
        console.log(error)
        return res.status(500).send('questionário não existe')
    }
}

export async function vote(req,res) {
    const choiceId = req.params.id;

    try {

        const choice = await db.collection('choices').findOne({_id: ObjectId (choiceId)});

        console.log(choiceId)
        if(!choice) {
            return res.status(404).send('Essa opção não existe');
        }

        const poolId = choice.poolId;

        const choicesOptions = await db.collection('pools').findOne({_id:ObjectId(poolId)});

        if(!choicesOptions){
            return res.status(404).send("essa enquete não existe")
        }

        const poolTime = choice.expireAt;

        const choiceDate = dayjs().format('YYYY-MM-D hh:mm');

        if(choiceDate > poolTime) {
            return res.status(404).send('Essa enquete já foi tirar do ar')
        }

        await db.collection('choices').updateOne({_id: ObjectId(choiceId)}, {$inc: {vote: 1}});

        console.log(choiceId)

        return res.status(201).send("voto adicionado ")

        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível adicionar o voto')
    }
}