import {Handler, EHandler} from "../types";
import {validationResult, Result, ValidationChain} from 'express-validator'
export {body, header, query, param} from 'express-validator'

const parseValidatorResult: Handler = (req, res, next) => {
    const errors: Result = validationResult(req)
    if (errors.isEmpty()) {
        next()
        return
    }

    const {r} = res
    r
        .status.BAD_REQ()
        .message("Request is invalid")
        .data(errors.mapped())
        .send()
}

export function inspectBuilder(...validators: ValidationChain[]): EHandler {
    //@ts-ignore
    return [...validators, parseValidatorResult as EHandler]
}