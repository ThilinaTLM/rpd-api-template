export enum MErrorCode {
    NO_ERROR,
    UNKNOWN,
    FOREIGN_KEY,
    NOT_FOUND,
    DB_CONNECTION,
    DUPLICATE_ENTRY
}

export interface MError {
    code: MErrorCode,
    constraint?: string,
    table?: string,
}

export const NoError: MError = {code: MErrorCode.NO_ERROR}
export const NotFound: MError = {code: MErrorCode.NOT_FOUND}

export const dbError_toMError = (error: any): MError => {
    switch (error.code) {
        case 'ECONNREFUSED':
            console.log("[ERROR][DB]: Couldn't Connect to Database.")
            return {code: MErrorCode.DB_CONNECTION};
        case "23505":
            console.log("[ERROR][DB]: Duplicate Database Entry.")
            return {
                code: MErrorCode.DUPLICATE_ENTRY,
                constraint: error.constraint,
                table: error.table,
            };
        case "23503":
            console.log("[ERROR][DB]: Not exist foreign key entry.")
            return {
                code: MErrorCode.FOREIGN_KEY,
                constraint: error.constraint,
                table: error.table,
            };
        default:
            console.log("[ERROR][DB]: Unknown Error -> ", error.code);
            console.log(error.message)
            return {code: MErrorCode.UNKNOWN,};
    }
}

export const toMErrorCode = (mError :MError) => mError.code