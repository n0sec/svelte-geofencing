import Database from 'better-sqlite3';

const db = new Database('plot_points.sqlite', { verbose: console.log });
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS points (
        hash TEXT PRIMARY KEY,
        point_json TEXT NOT NULL
    ) STRICT;
`);

export default db;
