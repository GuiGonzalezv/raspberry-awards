import { Router, Request, Response } from "express";
import moviesRouter from "./movies.controller";
import producersRouter from "./producers.controller";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use(moviesRouter);
router.use(producersRouter);

export default router;
