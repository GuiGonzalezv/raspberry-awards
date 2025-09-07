import { Movie } from "./IFeedDatabaseUseCase";
import { IntervalFilm } from "./IGetIntervalUseCase";

export interface IFeedDatabaseRepository {
    InsertMovies(list: Movie[]) : Promise<void>
    getData(): Promise<IntervalFilm[]>
}

export const IFeedDatabaseRepositoryToken = "IFeedDatabaseRepository"