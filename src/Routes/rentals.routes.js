import { Router } from "express";
import { getRentals, postRentals, returnRentals } from "../Controllers/rentals.controller.js";
import schemaVatidate from "../middlewares/validation.middlewares.js";
import rentalsSchema from "../Schemas/rentals.schemas.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", schemaVatidate(rentalsSchema), postRentals)
rentalsRouter.post("/rentals/:id/return", returnRentals)

export default rentalsRouter