import { MovieModel } from "@/domain/entities/MovieModel";
import { IMovieRepository } from "@/domain/ports/IMoviesRepository";
import { SqlDatabase } from "./Database";
import { injectable } from "tsyringe";
import { IProducerRepository } from "@/domain/ports/IProducerRepository";
import { IntervalFilm, IntervalModel } from "@/domain/entities/IntervalModel";

@injectable()
export class ProducerRepository implements IProducerRepository {
    constructor(private database: SqlDatabase) {}

    async GetInterval(): Promise<IntervalFilm[]> {
        const query = this.database.connection.prepare(`
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
        return rows;
    }
}
