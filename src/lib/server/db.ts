import Database from 'better-sqlite3';

const db = new Database('plot_points.sqlite', { verbose: console.log });
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS points (
        id TEXT PRIMARY KEY,
        point_string TEXT NOT NULL
    ) STRICT;
`);

export default db;
