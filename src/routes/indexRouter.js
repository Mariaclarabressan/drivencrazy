import { Router } from "express";
import poolRouter from '../routes/poolRouter.js';
import choiceRouter from "./choiceRouter.js";

const indexRouter = Router();

indexRouter.use(poolRouter);
indexRouter.use(choiceRouter);

export default indexRouter;