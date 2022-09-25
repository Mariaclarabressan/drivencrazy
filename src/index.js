import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRouter from './routes/indexRouter.js';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(indexRouter);

server.get('/status', (req, res) => {
    return res.send('ok');
  });
  server.listen(5000, () => {
    console.log(`Servidor entrou na porta ${process.env.PORT}`);
  });

