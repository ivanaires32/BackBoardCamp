import { Router } from "express";
import { getRentals, postRentals } from "../Controllers/rentals.controller.js";
import schemaVatidate from "../middlewares/validation.middlewares.js";
import rentalsSchema from "../Schemas/rentals.schemas.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", schemaVatidate(rentalsSchema), postRentals)

export default rentalsRouter