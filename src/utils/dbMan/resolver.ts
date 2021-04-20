import {QueryBuilder as KQueryBuilder, Transaction} from "knex";
import {dbError_toMError, MError, NoError, NotFound} from "./merror";
import {knex} from "./conn";
import {QueryBuilder, TransactionBuilder} from "./index";

interface ResolverOption {
    single?: boolean,
    required?: boolean,
}

async function resolveQuery<T>(
    qbQuery: Promise<Transaction> | KQueryBuilder<any, any>,
    options: ResolverOption = {}
): Promise<[MError, T]>
{
    options = {
        single: (options.single === undefined)? false: options.single,
        required: (options.required === undefined)? true: options.required
    }

    try {
        const data: any = (await qbQuery) || null

        // Resolve for single option
        const selected = (options.single)? (data && data.length > 0)? data[0]: null: data

        // Resolve for required
        if (options.required && !selected) {
            return [NotFound, {} as T]
        }
        return [NoError, selected as T];
    } catch (e) {
        return [dbError_toMError(e), {} as T]
    }
}

export function cleanQuery(query: any, fields: string[] | null = null) {
    const qClone = {...query}
    Object.keys(qClone).forEach(
        (k) => {
            if (fields === null || fields.includes(k) ) {
                (qClone[k] === null || qClone[k] === undefined) && delete qClone[k]
            } else {
                delete qClone[k]
            }

        }
    )

    return qClone
}


export async function runQuery<T>(qb: QueryBuilder, options?: ResolverOption) {
    const query = qb(knex)
    return await resolveQuery<T>(query, options)
}

export async function runTrx<T>(tb: TransactionBuilder, options: ResolverOption = {required: false}) {
    const trx = knex.transaction(tb)
    return await resolveQuery<T>(trx, options)
}
