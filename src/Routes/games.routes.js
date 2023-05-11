import { Router } from "express";
import { getGames, postGames } from "../Controllers/games.controllers.js";
import { validetionSchema } from "../middlewares/validation.middlewares.js";
import { gamesSchema } from "../Schemas/games.schema.js";

const gamesRoutes = Router();

gamesRoutes.get("/games", getGames)
gamesRoutes.post("/games", validetionSchema(gamesSchema), postGames)
export default gamesRoutes