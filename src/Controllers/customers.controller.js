import { db } from "../Database/database.js"
import dayjs from "dayjs"

export async function getCustomer(req, res) {

    try {


        const users = await db.query(`
            SELECT * FROM customers;
        `)

        const newArray = []

        for (let i = 0; i < users.rows.length; i++) {
            const dateFormat = users.rows[i].birthday
            const obj = {
                name: users.rows[i].name,
                phone: users.rows[i].phone,
                cpf: users.rows[i].cpf,
                birthday: dayjs(dateFormat).format('YYYY-MM-DD')
            }
            newArray.push(obj)
        }
        res.status(200).send(newArray)
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

    if (isNaN(cpf)) return res.status(400).send("CPF invalido")

    try {

        const usuarioCadastrado = await db.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [id])

        if (!usuarioCadastrado) return res.status(404).send("Usuario não cadastrado")

        await db.query(`
            UPDATE customers SET name='${name}', phone='${phone}, cpf='${cpf}, birthday='${birthday}'
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