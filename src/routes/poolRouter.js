import { Router } from "express";
import middlewarePool from '../middleware/middlewarePool.js';
import {postPool, getPool, showResults} from '../controllers/poolController.js';

const poolRouter = Router();

poolRouter.post('/pool', middlewarePool, postPool);
poolRouter.get('/pool', getPool);
poolRouter.get('/poll/:id/result', showResults);

export default poolRouter;