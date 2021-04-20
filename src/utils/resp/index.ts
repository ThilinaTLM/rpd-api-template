import {Handler} from "express";
import {ResponseBuilder} from "./res-builder";
import {Response} from "../types";

interface TokenPair {
    access: string,
    refresh?: string
}

export interface ResponseData {
    data?: any,
    token?: TokenPair,
    message: string
}

export const rBuilder: Handler = (req, res, next) => {
    (res as Response).r = new ResponseBuilder(res);
    next()
};