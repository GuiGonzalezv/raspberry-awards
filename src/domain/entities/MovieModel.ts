export class MovieModel {
    public year: number;
    public title: string;
    public studio: string;
    public producers: string[];
    public winner: boolean;

    constructor(
        year: number,
        title: string,
        studio: string,
        producers: string[],
        winner: boolean
    ) {
        this.year = year;
        this.title = title;
        this.studio = studio;
        this.producers = producers;
        this.winner = winner;
    }
}
