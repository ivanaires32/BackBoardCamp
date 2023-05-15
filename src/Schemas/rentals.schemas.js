import joi from "joi"

const rentalsSchema = joi.object({
    daysRented: joi.number().min(1).required(),
    customerId: joi.number(),
    gameId: joi.number()

})

export default rentalsSchema