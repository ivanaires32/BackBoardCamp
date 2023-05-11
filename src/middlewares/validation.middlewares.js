export default function schemaVatidate(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });

        if (validation.error) {
            const erros = validation.error.details.map(d => d.message)
            return res.status(400).send(erros)
        }

        next()
    }
}