import { IFeedDatabaseRepository, IFeedDatabaseRepositoryToken } from "@/domain/ports/IFeedDatabaseRepository";
import { GetIntervalResponse, IGetIntervalUseCase } from "@/domain/ports/IGetIntervalUseCase";
import { inject, injectable } from "tsyringe";
interface MovieRow {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string; 
}

@injectable()
export class GetIntervalsUseCase implements IGetIntervalUseCase {
    
    constructor (@inject(IFeedDatabaseRepositoryToken) private repository: IFeedDatabaseRepository) {}

    async Execute(): Promise<GetIntervalResponse> {
        var data = await this.repository.getData()
        
        const minIntervalValue = Math.min(...data.map(e => e.interval))
        const maxIntervalValue = Math.max(...data.map(e => e.interval))

        const response: GetIntervalResponse = {
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