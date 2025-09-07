import "reflect-metadata";
import express from 'express'
import routes from "./controllers";
import { setupSwagger } from './swagger';
import { container } from 'tsyringe';
import { FeedDatabaseRepository } from './infra/database/FeedDatabaseRepository';
import { SqlDatabase } from './infra/database/Database';
import { FeedDatabaseUseCase } from './application/UseCases/FeedDatabaseUseCase';
import path from 'path';
import { IFeedDatabaseRepositoryToken } from './domain/ports/IFeedDatabaseRepository';
import { GetIntervalsUseCase } from './application/UseCases/GetIntervalsUseCase';

async function bootstrap () {
    const database = container.resolve(SqlDatabase);
    await database.ready; 

    container.registerSingleton(IFeedDatabaseRepositoryToken, FeedDatabaseRepository)

    var useCase = container.resolve(FeedDatabaseUseCase);
    container.resolve(GetIntervalsUseCase);

    const csvPath = path.resolve(__dirname, "./Movielist.csv");
    console.log("---- Importanto arquivos para base de dados ----", new Date())
    await useCase.Execute(csvPath)
    console.log("---- Importação finalizada ----", new Date())
    const app = express()
    
    app.use(express.json()); 
    app.use(routes);
    
    setupSwagger(app);
    
    app.listen(80, () => {
        console.log("Server rodando na porta 80");
        console.log("Swagger - http://localhost:80/api-docs");
    })
}

bootstrap()
