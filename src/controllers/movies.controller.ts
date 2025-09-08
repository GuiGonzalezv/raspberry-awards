import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { GetMovieUseCase } from "@/application/UseCases/GetMovieUseCase";

const moviesRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Movies
 *   description: Endpoints relacionados a filmes
 */

/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Retorna os filmes cadastrados
 *     parameters:
 *       - in: query
 *         name: winner
 *         schema:
 *           type: boolean
 *         description: Filtra por filmes vencedores
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtra por ano
 *       - in: query
 *         name: producer
 *         schema:
 *           type: string
 *         description: Filtra por nome do produtor
 *     responses:
 *       200:
 *         description: Filmes cadastrados
 */
moviesRouter.get("/api/movies", async (req: Request, res: Response) => {
  const useCase = container.resolve(GetMovieUseCase);

  const winner = req.query.winner as string | undefined;
  const year = req.query.year as string | undefined;
  const producer = req.query.producer as string | undefined;

  const results = await useCase.Execute(winner, year, producer);
  res.status(200).json(results);
});

export default moviesRouter;
