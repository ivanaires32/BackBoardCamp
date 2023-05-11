import joi from "joi"

export const gamesSchema = joi.object({
    name: joi.string().required().min(1),
    image: joi.string().valid("http"),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
})