require('dotenv').config()

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            database: process.env.PG_DB,
            user: process.env.PG_USER,
            password: process.env.PG_PASS
        },
        migrations: {
            directory: './knex/migrates',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './knex/seeds',
            tableName: 'knex_seeds'
        }
    }
};
