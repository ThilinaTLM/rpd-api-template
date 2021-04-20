import {ResponseBuilder} from "./res-builder";

export const ISE = (rb: ResponseBuilder): ResponseBuilder => {
    rb
        .status.ERROR()
        .message("Internal Server Error")
        .send()
    return rb
}

export const OK = (rb: ResponseBuilder): ResponseBuilder => {
    rb
        .status.OK()
        .message("Success")
    return rb
}