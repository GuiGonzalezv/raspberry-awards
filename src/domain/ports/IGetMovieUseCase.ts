import { MovieModel } from "../entities/MovieModel";

export interface IGetMovieUseCase {
    Execute(winner?: string, year?: string, producer?: string) : Promise<MovieModel[]>
}



