// import * as schema from '@/db/schema'
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import { env } from '../config/env';
import * as schema from './schemas';
import mysql from 'mysql2/promise';
import { DB_LOGGING } from '../config/constants';

export const poolConnection = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.NODE_ENV === 'test' ? env.TEST_DB_NAME : env.DB_NAME,
	port: Number(env.DB_PORT),
	connectionLimit:
		process.env.DB_MIGRATING === 'true' || process.env.DB_SEEDING === 'true' ? 1 : 50,
	waitForConnections: true,
	queueLimit: 0,
	ssl: {
		minVersion: 'TLSv1.2',
		rejectUnauthorized: true,
	},
	enableKeepAlive: true,
	idleTimeout: 240000,
});

const db = drizzle(poolConnection, {
	schema,
	mode: 'default',
	casing: 'snake_case',
	logger: DB_LOGGING,
});

export type AppDatabase = MySql2Database<typeof schema>;

export default db;
