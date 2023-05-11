import { Router } from "express";
import gamesRoutes from "./games.routes.js";

const router = Router()

router.use(gamesRoutes)

export default router