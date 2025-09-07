export interface IGetIntervalUseCase {
    Execute() : Promise<GetIntervalResponse>
}

export interface GetIntervalResponse {
   min: IntervalFilm[]
   max: IntervalFilm[]
}

export interface IntervalFilm {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

