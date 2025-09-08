import { MovieModel } from "../entities/MovieModel"

export interface IMovieRepository {
    GetMovies(winner?: boolean, year?: number, producer?: string) : Promise<MovieModel[]>
}

export const IMoviesRepositoryToken = "IMovieRepository"