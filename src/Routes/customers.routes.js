import { Router } from "express";
import { postCustomer, getCustomer, getCustomerId, putCustomerId } from "../Controllers/customers.controller.js";
import schemaVatidate from "../middlewares/validation.middlewares.js";
import { customersSchema } from "../Schemas/customers.schema.js";

const customersRoutes = Router()

customersRoutes.post("/customers", schemaVatidate(customersSchema), postCustomer)
customersRoutes.get("/customers", getCustomer)
customersRoutes.get("/customers/:id", getCustomerId)
customersRoutes.put("/customers/:id", schemaVatidate(customersSchema), putCustomerId)


export default customersRoutes