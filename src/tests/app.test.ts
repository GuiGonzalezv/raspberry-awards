import request from 'supertest';
import path from 'path';
import "reflect-metadata";
import { container } from 'tsyringe';
import { createApp } from '..';
import { SqlDatabase } from '../infra/database/Database';
import { FeedDatabaseUseCase } from '../application/UseCases/FeedDatabaseUseCase';
import { Express } from "express";

let app: Express; // aqui não é Promise, é o app real

beforeAll(async () => {
    const database = new SqlDatabase();
    await database.ready;
    app = await createApp();

    const feedUseCase = container.resolve(FeedDatabaseUseCase);
    const csvPath = path.resolve(__dirname, '../data/Movielist.csv');
    await feedUseCase.Execute(csvPath);
});


afterAll(async () => {
    const db = container.resolve(SqlDatabase);
    await db.disconnect();
});

describe('GET /api/producers/intervals', () => {
    it('should return producers with max and min intervals', async () => {
        const res = await request(app).get('/api/producers/intervals');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('max');
        expect(res.body).toHaveProperty('min');

        expect(res.body.max[0]).toMatchObject({
            producer: 'Matthew Vaughn',
            interval: 13,
            previousWin: 2002,
            followingWin: 2015
        });

        expect(res.body.min[0]).toMatchObject({
            producer: 'Joel Silver',
            interval: 1,
            previousWin: 1990,
            followingWin: 1991
        });
    });
});

describe('GET /api/movies', () => {
    it('should return all movies', async () => {
        const res = await request(app).get('/api/movies');
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('year');
        expect(res.body[0]).toHaveProperty('title');
        expect(res.body[0]).toHaveProperty('studio');
        expect(res.body[0]).toHaveProperty('producers');
        expect(res.body[0]).toHaveProperty('winner');
        expect(res.body.length).toBe(206);
    });

    it('should return all winner movies', async () => {
        const res = await request(app).get('/api/movies?winner=true');
        expect(res.status).toBe(200);
        var findLoser = res.body.find((x: any) => !x.winner)
        expect(!!findLoser).toBe(false);
    });

    it('should return all movies from specific year', async () => {
        const res = await request(app).get('/api/movies?year=1996');
        expect(res.status).toBe(200);
        var not1996 = res.body.find((x: any) => x.year != "1996")
        expect(!!not1996).toBe(false);
    });

    it('should return all movies from specific Producer', async () => {
        const res = await request(app).get('/api/movies?year=Joel Silver');
        expect(res.status).toBe(200);
        var anotherProducer = res.body.find((x: any) => x.producer != "Joel Silver")
        expect(!!anotherProducer).toBe(false);
    });
});
