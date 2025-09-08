import { IntervalModel } from "../entities/IntervalModel";

export interface IGetIntervalUseCase {
    Execute() : Promise<IntervalModel>
}

