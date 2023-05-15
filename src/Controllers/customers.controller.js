import { db } from "../Database/database.js"
import dayjs from "dayjs"

export async function getCustomer(req, res) {

    try {


        const users = await db.query(`
            SELECT * FROM customers;
        `)
        users.rows = users.rows.map(u => ({
            ...u,
            birthday: new Date(u.birthday).toISOString().split('T')[0]
        }))
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

        user.rows = user.rows.map(u => ({
            ...u,
            birthday: new Date(u.birthday).toISOString().split('T')[0]
        }))
        res.status(200).send(user.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function putCustomerId(req, res) {
    const { id } = req.params
    const { name, phone, cpf, birthday } = req.body

    if (isNaN(cpf)) return res.status(400).send("CPF invalido")

    try {

        const usuarioCadastrado = await db.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [id])

        if (!usuarioCadastrado) return res.status(404).send("Usuario não cadastrado")

        const conflit = await db.query(`
            SELECT * FROM customers WHERE cpf='${cpf}'
        ;`)

        if (conflit.rows.length > 0 && (conflit.rows[0].cpf !== cpf || conflit.rows[0].name !== name)) return res.status(409).send("CPF já cadastrado")

        console.log(conflit.rows)
        await db.query(`
            UPDATE customers SET name='${name}'
            WHERE id=$1;
        `, [id])
        await db.query(`
            UPDATE customers SET phone='${phone}'
            WHERE id=$1;
        `, [id])
        await db.query(`
            UPDATE customers SET cpf='${cpf}'
            WHERE id=$1;
        `, [id])

        await db.query(`
            UPDATE customers SET birthday='${birthday}'
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

        if (isNaN(cpf)) return res.status(400).send("CPF invalido")

        if (isNaN(phone)) return res.status(400).send("Telefone invalido")

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