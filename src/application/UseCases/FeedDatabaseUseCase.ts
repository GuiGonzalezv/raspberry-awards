import { IFeedDatabaseRepository, IFeedDatabaseRepositoryToken } from "@/domain/ports/IFeedDatabaseRepository";
import { FilmEntry, IFeedDatabaseUseCase, Movie } from "@/domain/ports/IFeedDatabaseUseCase";
import fs from 'fs'
import { inject, injectable } from "tsyringe";
import csv from "csv-parser";
interface MovieRow {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string; 
}

@injectable()
export class FeedDatabaseUseCase implements IFeedDatabaseUseCase {
    
    constructor (@inject(IFeedDatabaseRepositoryToken) private repository: IFeedDatabaseRepository) {}

    Execute(path: string): Promise<void> {
        const batchSize = 1000;
        let batch: Movie[] = [];

        return new Promise<void>((resolve, reject) => {
            fs.createReadStream(path)
            .pipe(csv({separator: ";"}))
            .on("data", (row: MovieRow) => {
                
                const producers = row.producers
                    .split(/\s*(?:,|\band\b)\s*/i)
                    .map(p => p.trim())
                    .filter(p => p.length > 0 && p !== "");
                    
                const winner = row.winner.toLowerCase() === "yes";

                batch.push({
                    year: Number(row.year),
                    title: row.title,
                    studios: row.studios,
                    producers,
                    winner
                });

                if (batch.length >= batchSize) {
                    this.repository.InsertMovies(batch).catch(reject);
                    batch = [];
                }
            })
            .on("end", async () => {
                if (batch.length > 0) {
                    this.repository.InsertMovies(batch);
                }
                resolve();
            })
            .on("error", reject);
        });

    }
}