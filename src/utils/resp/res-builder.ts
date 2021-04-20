import {Response} from "express";
import {StatusCode} from "./status-code";
import {ISE, OK} from "./prebuilds";
import {ResponseData} from "./index";

export class ResponseBuilder {
    readonly status: StatusCode;
    readonly pb = {
        ISE: () => ISE(this),
        OK: ()  => OK(this)
    };

    private _res: Response;
    private readonly _data: ResponseData;

    constructor(res: Response) {
        this.status = new StatusCode(this, 500);
        this._data = { message: "Success" };
        this._res = res;
    }

    send(): void {
        this._res.status(this.status.code);
        this._res.json(this._data);
    };

    token(access: string): ResponseBuilder {
        this._data.token = {access: access};
        return this;
    }

    tokenPair(access: string, refresh: string) {
        this._data.token = {access: access, refresh: refresh};
        return this;
    }

    message(msg: string): ResponseBuilder {
        this._data.message = msg;
        return this;
    }

    data(data: any): ResponseBuilder {
        this._data.data = data;
        return this;
    }
}