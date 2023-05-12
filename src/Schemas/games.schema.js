import joi from "joi"

export const gamesSchema = joi.object({
    name: joi.string().required().min(1),
    image: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required()
})