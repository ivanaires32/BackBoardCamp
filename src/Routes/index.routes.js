import { Router } from "express";
import gamesRoutes from "./games.routes.js";
import customersRoutes from "./customers.routes.js";
import rentalsRouter from "./rentals.routes.js";

const router = Router()

router.use(gamesRoutes)
router.use(customersRoutes)
router.use(rentalsRouter)

export default router