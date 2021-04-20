require("dotenv").config();
import {knexSnakeCaseMappers} from "objection";
import Knex, {Config} from "knex";

/**
 * Knex Configuration Options
 * Postgresql
 * (knexSnakeCaseMapper <- Maps snake case to camel case)
 * ::: only for internal use
 */
const knex_config: Config = {
    client: "postgresql",
    connection: {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT) || 5432,
        database: process.env.PG_DB,
        user: process.env.PG_USER,
        password: process.env.PG_PASS
    },
    ...knexSnakeCaseMappers()
};

/**
 * Create Knex Client using 'knex_config'
 * ::: only for internal use
 */
export const knex = Knex(knex_config);

