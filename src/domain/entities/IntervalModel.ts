export class IntervalModel {
    public min: IntervalFilm[];
    public max: IntervalFilm[];

    constructor(
        min: IntervalFilm[],
        max: IntervalFilm[],
    ) {
        this.min = min;
        this.max = max;
    }
}

export interface IntervalFilm {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}