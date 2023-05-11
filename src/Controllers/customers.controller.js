import { db } from "../Database/database.js"

export async function getCustomer(req, res) {
    try {
        const users = await db.query(`
            SELECT * FROM customers;
        `)
        res.status(200).send(users.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerId(req, res) {
    const { id } = req.params
    try {
        const user = await db.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [id])

        if (!user.rows[0]) return res.sendStatus(404)
        res.status(200).send(user.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function putCustomerId(req, res) {
    const { id } = req.params
    const { name, phone, cpf, birthday } = req.body
    try {
        await db.query(`
            UPDATE customers SET name='${name}' 
            WHERE id=$1;
        `, [id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body
    try {

        const conflit = await db.query(`
            SELECT * FROM customers WHERE cpf='${cpf}'
        ;`)

        if (conflit.rows.length > 0) return res.status(409).send("CPF já cadastrado")

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');
        `,)


        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}