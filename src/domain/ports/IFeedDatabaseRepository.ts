import { Movie } from "./IFeedDatabaseUseCase";

export interface IFeedDatabaseRepository {
    InsertMovies(list: Movie[]) : Promise<void>
}

export const IFeedDatabaseRepositoryToken = "IFeedDatabaseRepository"