import { MovieModel } from "@/domain/entities/MovieModel";
import { IGetMovieUseCase } from "@/domain/ports/IGetMovieUseCase";
import { IMovieRepository, IMoviesRepositoryToken } from "@/domain/ports/IMoviesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetMovieUseCase implements IGetMovieUseCase {
    
    constructor (@inject(IMoviesRepositoryToken) private repository: IMovieRepository) {}

    async Execute(winner?: string, year?: string, producer?: string): Promise<MovieModel[]> {
        return await this.repository.GetMovies(winner ? winner === "true" : undefined, year ? Number(year) : undefined, producer)
    }
}