import db from '../mongo/db.js';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

export async function postPool(req,res) {
    const {title, expireAt} = req.body;
    const pool = req.body;

    try {

        const findPool = await db.collection('pools').findOne({title});

        if(findPool) {
            return res.status(409).send('Já existe um questionário com esse título')
        }

        if(!expireAt){
            let formalTime = dayjs().add(30,'day').format('YYYY-MM-D hh:mm');

            const finishPool = {title, expireAt: formalTime};
            await db.collection('pools').insertOne(finishPool);
            return res.status(201).send(`Questionário ${title} criado com sucesso!`);
        }

        await db.collection('pools').insertOne(pool);
        return res.status(201).send(`Questionário ${title} criado com sucesso!`);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível enviar o questionário')        
    }
}

export async function getPool(req,res){
    const showPools = await db.collection('pools').find().toArray();

    try {

        if(showPools.length === 0){
            return res.status(204).send('Nenhum questionário foi criado ainda')
        }

        return res.status(200).send(showPools);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro ao se conectar com servidor, não possível mostrar os questionários')
    }
}

export async function showChoices(){
    const poolId = req.params.id;

    try {
        
        const options = await db.collection('choices').find({poolId:poolId}).toArray();

        if(!options) {
            return res.status(404).send('Essa enquete ainda não existe')
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Não foi possível buscar as opções da enquete")
    }
}

export async function showResults(req, res){

    const poolId = req.params.id;

    try {
        
        let choices = await db.collection('choices').find({poolId: poolId}).toArray();

        let votesChoice = 0;
        let titleChoice= '';

        for (let i = 0; i< choices.length; i++){
            let finalVotes = choices[i].votes;

            if(finalVotes> votesChoice){
                votesChoice = finalVotes;
                titleChoice = choices[i].title;
            }
        }

        const pollresult = await db.collection('choices').find({votes:votesChoice}).toArray();

        let result = {};

        if(pollresult.length === 1 ){
            result = {
                title: titleChoice,
                votes: votesChoice,
            };
        }

        if(pollresult.length >= 3){
            return res.status(207).send('Empate tecnico')
        }

        const poll = await db.collection('pools').findOne({_id: ObjectId(poolId)});

        const finalResults = {...poll, result};

        return res.status(200).send(finalResults);


    } catch (error) {
        console.log(error);
        return res.status(500).send("Não foi possível mostrar os resultados")
    }

}