import { MovieModel } from "@/domain/entities/MovieModel";
import { IMovieRepository } from "@/domain/ports/IMoviesRepository";
import { SqlDatabase } from "./Database";
import { injectable } from "tsyringe";

@injectable()
export class MovieRepository implements IMovieRepository {
    constructor(private database: SqlDatabase) {}

    async GetMovies(winner?: boolean, year?: number, producer?: string): Promise<MovieModel[]> {
        const filters: string[] = [];
        const params: Record<string, any> = {};

        if (winner !== undefined) {
            filters.push("m.winner = @winner");
            params.winner = winner ? 1 : 0;
        }

        if (year !== undefined) {
            filters.push("m.year = @year");
            params.year = year;
        }

        if (producer) {
            filters.push("mp.producer_id IN (SELECT id FROM producers WHERE name = @producer)");
            params.producer = producer;
        }

        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

        const query = this.database.connection.prepare(`
            SELECT 
                m.id, 
                m.year, 
                m.title, 
                m.studios, 
                m.winner,
                GROUP_CONCAT(p.name) AS producers
            FROM movies m
                LEFT JOIN movies_producers mp ON mp.movie_id = m.id
                LEFT JOIN producers p ON mp.producer_id = p.id
                ${whereClause}
            GROUP BY m.id
        `);

        const rows = query.all(params) as any[];

        return rows.map(row => new MovieModel(
            Number(row.year),
            row.title,
            row.studios,
            row.producers ? row.producers.split(",") : [],
            Boolean(row.winner)
        ));
    }
}
