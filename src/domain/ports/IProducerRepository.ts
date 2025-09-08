import { IntervalFilm } from "../entities/IntervalModel"

export interface IProducerRepository {
    GetInterval() : Promise<IntervalFilm[]>
}

export const IProducerRepositoryToken = "IProducerRepository"