import { Router } from "express";

import middlewareChoice from '../middleware/middlewareChoice.js';

import {postChoice, vote} from '../controllers/choiceController.js';

const choiceRouter = Router();

choiceRouter.post('/choice', middlewareChoice, postChoice);

choiceRouter.post('/choice/:id/vote', vote);

export default choiceRouter;