import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { GetIntervalsUseCase } from "@/application/UseCases/GetIntervalsUseCase";

const producersRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Producers
 *   description: Endpoints relacionados a produtores
 */

/**
 * @openapi
 * /api/producers/intervals:
 *   get:
 *     tags:
 *       - Producers
 *     summary: Retorna o produtor que demorou mais e o que demorou menos para conseguir dois prêmios
 *     responses:
 *       200:
 *         description: Intervalo de premiação
 */
producersRouter.get("/api/producers/intervals", async (_req: Request, res: Response) => {
  const useCaseGetIntervals = container.resolve(GetIntervalsUseCase);
  const results = await useCaseGetIntervals.Execute();
  res.status(200).json(results);
});

export default producersRouter;
