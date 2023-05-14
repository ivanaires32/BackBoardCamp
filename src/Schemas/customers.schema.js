import joi from "joi"


export const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).required(),
    birthday: joi.string().pattern(/^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/).required()
})