import { IntervalModel } from "@/domain/entities/IntervalModel";
import { IGetIntervalUseCase } from "@/domain/ports/IGetIntervalUseCase";
import { IProducerRepository, IProducerRepositoryToken } from "@/domain/ports/IProducerRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetIntervalsUseCase implements IGetIntervalUseCase {
    
    constructor (@inject(IProducerRepositoryToken) private repository: IProducerRepository) {}

    async Execute(): Promise<IntervalModel> {
        var data = await this.repository.GetInterval()
        
        const minIntervalValue = Math.min(...data.map(e => e.interval))
        const maxIntervalValue = Math.max(...data.map(e => e.interval))

        const response: IntervalModel = {
          max: [],
          min: []
        }

        for(let interval of data) {
          const existOnMax = response.max.find((e) => e.producer === interval.producer)
          const existOnMin = response.min.find((e) => e.producer === interval.producer)

          if(!existOnMin && interval.interval === minIntervalValue) response.min.push(interval)
          if(!existOnMax && interval.interval === maxIntervalValue) response.max.push(interval)
        }

        return response
    }
}