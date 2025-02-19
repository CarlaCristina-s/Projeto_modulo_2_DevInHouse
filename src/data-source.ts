require('dotenv').config()

import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development' ? true : false ,
    entities: [`${__dirname}/entities/*.{ts,js}`],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    subscribers: [],
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : undefined,
    migrationsRun: process.env.NODE_ENV === 'production' ? true : false
})
