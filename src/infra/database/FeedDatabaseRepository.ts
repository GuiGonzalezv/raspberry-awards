import { IFeedDatabaseRepository } from "@/domain/ports/IFeedDatabaseRepository";
import { Movie } from "@/domain/ports/IFeedDatabaseUseCase";
import { injectable } from "tsyringe";
import { SqlDatabase } from "./Database";
import { IntervalFilm } from "@/domain/ports/IGetIntervalUseCase";
export interface Film {
    year: number;
    title: string;
    studios: string;
    winner: boolean;
    interval: number | null;
}
export interface ProducerResult {
    producer: string;
    films: Film[];
    maxInterval: number | null;
    minInterval: number | null;
}

@injectable()
export class FeedDatabaseRepository implements IFeedDatabaseRepository {

    constructor (private db: SqlDatabase) {}

    async InsertMovies(list: Movie[]): Promise<void> {
        const insertMovie = this.db.connection.prepare(`
            INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)
        `);

        const insertProducer = this.db.connection.prepare(`
            INSERT OR IGNORE INTO producers (name) VALUES (?)
        `);

        const getProducerId = this.db.connection.prepare(`
            SELECT id FROM producers WHERE name = ?
        `);

        const insertMovieProducer = this.db.connection.prepare(`
            INSERT INTO movies_producers (movie_id, producer_id) VALUES (?, ?)
        `);

        const insertMany = this.db.connection.transaction((movies: Movie[]) => {
            for (const m of movies) {
                const movieResult = insertMovie.run(m.year, m.title, m.studios, m.winner ? 1 : 0);
                const movieId = movieResult.lastInsertRowid as number;

                for (const producer of m.producers) {
                    insertProducer.run(producer.trim());
                    const producerId = getProducerId.get(producer.trim()).id as number;
                    insertMovieProducer.run(movieId, producerId);
                }
            }
        });

        insertMany(list);
    }

    async getData(): Promise<IntervalFilm[]> {
        const query = this.db.connection.prepare(`
            SELECT
                producer,
                (followingWin - previousWin) AS interval,
                previousWin,
                followingWin
            FROM (
                SELECT 
                    p.name AS producer,
                    m.year AS previousWin,
                    LEAD(m.year) OVER (PARTITION BY p.name ORDER BY m.year) AS followingWin
                        FROM movies m
                        JOIN movies_producers mp ON mp.movie_id = m.id
                        JOIN producers p ON p.id = mp.producer_id
                        WHERE m.winner = 1 )
            WHERE followingWin IS NOT NULL AND interval > 0
        `);

        const rows = await query.all() as IntervalFilm[];
        console.log(rows)
        return rows;
    }
}
