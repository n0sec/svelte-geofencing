import Database from 'better-sqlite3';
import type { Handle } from '@sveltejs/kit';
import fs from 'fs';

export const handle: Handle = async ({ event, resolve }) => {
	const db = new Database('points.db', { verbose: console.log });
	const migration = fs.readFileSync('src\\data\\migrate-schema.sql', 'utf8');

	db.exec(migration);

	const response = await resolve(event);
	return response;
};
