import {runQuery, runTrx, TransactionBuilder} from "../utils/dbMan";
import {MError} from "../utils/dbMan/merror";
import {AdminAccount, LocalAccount, UserData} from "./types";

/**
 * Transaction Pieces
 * @param userData
 */

/**
 * Queries
 * @param userData
 * @param localAccount
 */
export abstract class UserModel {

    private static TB_userData = "userData"
    private static TB_localAccount = "localAccount"
    private static TB_adminAccount = "adminAccount"


    static $add_UserData(userData: UserData): TransactionBuilder {
        return async trx => {
            return trx(this.TB_userData).insert(userData);
        };
    };

    static accountTypes = {
        local: "Local Account",
        admin: "Admin Account",
    }

    /**
     * Creators
     */
    static add_LocalAccount(userData: UserData, accountData: LocalAccount) {
        return runTrx(async trx =>  {
            await this.$add_UserData(userData)(trx);
            return trx(this.TB_localAccount).insert(accountData);
        });
    };

    /**
     * Update
     */
    static update_UserDetails(userId: string, data: any) {
        return runQuery(
            knex => knex(this.TB_userData).update(data).where({userId})
        )
    }

    static update_LocalAccount(userId: string, data: any) {
        return runQuery(
            knex => knex(this.TB_localAccount).update(data).where({userId})
        )
    }

    /**
     * Getters
     */
    static async get_AdminAccount(username: string): Promise<[MError, AdminAccount]> {
        return runQuery<AdminAccount>(
            knex => knex(this.TB_adminAccount).where({username}),
            {
                single: true
            }
        )
    }

    static get_LocalAccount(username: string): Promise<[MError, LocalAccount]> {
        return runQuery<LocalAccount>(
            knex => knex(this.TB_localAccount).where({username}),
            {
                single: true
            }
        )
    }

    static get_LocalAccount_byUserId(userId: string): Promise<[MError, LocalAccount]> {
        return runQuery<LocalAccount>(
            knex => knex(this.TB_localAccount).where({userId}),
            {
                single: true
            }
        )
    }

    static get_UserData(userId: string): Promise<[MError, UserData]> {
        return runQuery<UserData>(
            knex => knex(this.TB_userData).where({userId}),
            {
                single: true
            }
        )
    }
}
