require("dotenv").config(); // read .env variables (for development)
import express from "express";
import cors from "cors"
import rApi from "./api";
import rFile from "./file";

const PORT = Number(process.env.PORT) || 8000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors() as express.NextFunction);

// Routers
app.use('/api', rApi)
app.use('/file', rFile)

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
