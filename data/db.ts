import Database from 'better-sqlite3';
export const db = new Database('points.db', { verbose: console.log });
