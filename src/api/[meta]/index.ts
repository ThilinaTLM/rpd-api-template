import {Router} from "express";

const rMeta = Router();

rMeta.get('/', (_, res) => res.send('Meta data module'))

export default rMeta
