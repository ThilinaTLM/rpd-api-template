import {Response as EResponse, Request as ERequest, NextFunction} from "express";
import {ResponseBuilder} from "./resp/res-builder";

export interface Request extends ERequest {
    user: {
        userId: string,
        accountType: "Local Account" | "Admin Account"
        firstName: string,
        lastName: string,
        email: string,
    }
}

export interface Response extends EResponse {
    r: ResponseBuilder
}

export type Handler = (req: Request, res: Response, next: NextFunction) => void

export {Response as EResponse} from "express"
export {Request as ERequest} from "express"
export {Handler as EHandler} from "express"
