import {ResponseBuilder} from "./res-builder";

export class StatusCode {
    private readonly parent: ResponseBuilder;

    constructor(p: ResponseBuilder, code: number) {
        this.parent = p;
        this._code = code;
    }

    private _code: number;

    get code() {
        return this._code;
    }

    OK(): ResponseBuilder {
        return this.setCode(200);
    }

    CREATED(): ResponseBuilder {
        return this.setCode(201);
    }

    NO_CONTENT(): ResponseBuilder {
        return this.setCode(204);
    }

    MV_PERM(): ResponseBuilder {
        return this.setCode(301);
    }

    NOT_MOD(): ResponseBuilder {
        return this.setCode(304);
    }

    BAD_REQ(): ResponseBuilder {
        return this.setCode(400);
    }

    UN_AUTH(): ResponseBuilder {
        return this.setCode(401);
    }

    FORBIDDEN(): ResponseBuilder {
        return this.setCode(403);
    }

    NOT_FOUND(): ResponseBuilder {
        return this.setCode(404);
    }

    EXPIRED(): ResponseBuilder {
        return this.setCode(440);
    }

    ERROR(): ResponseBuilder {
        return this.setCode(500);
    }

    private setCode(code: number): ResponseBuilder {
        this._code = code;
        return this.parent;
    }
}