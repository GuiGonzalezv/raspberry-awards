export interface IFeedDatabaseUseCase {
    Execute(path: string) : void
}

export interface Movie {
    year: number
    title: string
    studios: string
    producers: string[]
    winner: boolean
}

export interface FilmEntry {
  year: number;
  title: string;
  studios: string;
  winner: boolean;
  interval?: number | null;
}

