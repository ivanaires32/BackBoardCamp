import { Router } from "express";
import { getGames, postGames } from "../Controllers/games.controllers.js";
import { gamesSchema } from "../Schemas/games.schema.js";
import schemaVatidate from "../middlewares/validation.middlewares.js";


const gamesRoutes = Router();

gamesRoutes.get("/games", getGames)
gamesRoutes.post("/games", schemaVatidate(gamesSchema), postGames)
export default gamesRoutes