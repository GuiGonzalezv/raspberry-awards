import { singleton } from "tsyringe";
import Database from "better-sqlite3";

@singleton()
export class SqlDatabase {
  private db!: Database.Database;
  public ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init() {
    this.db = new Database(":memory:");
    this.db.pragma("foreign_keys = ON");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        studios TEXT,
        winner INTEGER NOT NULL
      );
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS producers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );`
    )

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS movies_producers (
        movie_id INTEGER NOT NULL,
        producer_id INTEGER NOT NULL,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (producer_id) REFERENCES producers(id),
        PRIMARY KEY (movie_id, producer_id)
      );
    `)

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_producers_name ON producers(name);
      CREATE INDEX IF NOT EXISTS idx_movies_producer_year ON movies_producers(producer_id, movie_id);
    `);

    console.log("SQLite in-memory conectado");
  }

  public get connection(): any {
    return this.db;
  }

  public async disconnect() {
    this.db.close();
    console.log("SQLite desconectado");
  }
}
