import { Router } from "express";
import { container } from "tsyringe";
import { GetIntervalsUseCase } from "@/application/UseCases/GetIntervalsUseCase";
const router = Router();

/**
 * @openapi
 * /api/interval:
 *   get:
 *     summary: Retorna o produtor que demorou mais tempo para conseguir dois premios e o que demorou menos
 *     responses:
 *       200:
 *         description: Intervalo de premiação
 */
router.get("/api/interval", async (_req, res) => {
  const useCaseGetIntervals = container.resolve(GetIntervalsUseCase)
  const results = await useCaseGetIntervals.Execute();
  res.status(200).json(results);
});

export default router;
