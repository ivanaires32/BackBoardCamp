import { Router } from "express";
import gamesRoutes from "./games.routes.js";
import customersRoutes from "./customers.routes.js";

const router = Router()

router.use(gamesRoutes)
router.use(customersRoutes)

export default router