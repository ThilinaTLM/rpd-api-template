import {MErrorCode, toMErrorCode} from "./merror";
import Knex, {QueryBuilder as KQueryBuilder, Transaction} from "knex";

export type QueryBuilder = (knex: Knex<any, any>, query?: any) => KQueryBuilder<any, any>
export type TransactionBuilder = (trx: Transaction) => Promise<Transaction>

export {runQuery, runTrx, cleanQuery} from "./resolver";
export const MErr = {
    toMErrorCode,
    ...MErrorCode
}