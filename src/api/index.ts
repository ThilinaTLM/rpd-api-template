import {Router} from "express";
import cAbout from "./about";
import {rBuilder} from "../utils/resp";

import rUser from "./[user]"
import rMeta from "./[meta]";

export const rApi = Router();

// Specific middlewares for /api routes
rApi.use(rBuilder);

// Endpoints
rApi.get("/", cAbout);

// Routers
rApi.use("/user", rUser)
rApi.use("/meta", rMeta)

// Router
export default rApi
