import "reflect-metadata";
import express from 'express'
import routes from "./controllers";
import { setupSwagger } from './swagger';
import { container } from 'tsyringe';
import { FeedDatabaseRepository } from './infra/database/FeedDatabaseRepository';
import { SqlDatabase } from './infra/database/Database';
import { FeedDatabaseUseCase } from './application/UseCases/FeedDatabaseUseCase';
import path from 'path';
import { IFeedDatabaseRepository, IFeedDatabaseRepositoryToken } from './domain/ports/IFeedDatabaseRepository';
import { GetIntervalsUseCase } from './application/UseCases/GetIntervalsUseCase';
import { IMovieRepository, IMoviesRepositoryToken } from "./domain/ports/IMoviesRepository";
import { MovieRepository } from "./infra/database/MovieRepository";
import { GetMovieUseCase } from "./application/UseCases/GetMovieUseCase";
import { IProducerRepository, IProducerRepositoryToken } from "./domain/ports/IProducerRepository";
import { ProducerRepository } from "./infra/database/ProducerRepository";

export async function createApp() {
    const database = container.resolve(SqlDatabase);
    await database.ready;

    container.registerSingleton<IFeedDatabaseRepository>(IFeedDatabaseRepositoryToken, FeedDatabaseRepository);
    container.registerSingleton<IMovieRepository>(IMoviesRepositoryToken, MovieRepository);
    container.registerSingleton<IProducerRepository>(IProducerRepositoryToken, ProducerRepository);

    container.resolve(GetIntervalsUseCase);
    container.resolve(GetMovieUseCase);

    const app = express();
    app.use(express.json());
    app.use(routes);
    setupSwagger(app);

    return app;
}

if (require.main === module) {
    (async () => {
        const app = await createApp();
        const port = process.env.PORT ?? 3000;

        // Importação do CSV apenas uma vez (ou pode mover para um script de seed)
        const feedUseCase = container.resolve(FeedDatabaseUseCase);
        const csvPath = path.resolve(__dirname, "./data/Movielist.csv");
        console.log("---- Importando arquivos para base de dados ----", new Date());
        await feedUseCase.Execute(csvPath);
        console.log("---- Importação finalizada ----", new Date());
        
        app.listen(port, () => {
            console.log("Server rodando na porta " + port);
            console.log(`Swagger - http://localhost:${port}/api-docs`);
        });
    })();
}