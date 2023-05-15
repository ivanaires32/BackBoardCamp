import dayjs from "dayjs"
import { db } from "../Database/database.js"


export async function getRentals(req, res) {
    try {
        const alugueis = await db.query(`
            SELECT * FROM rentals
        `)

        res.send(alugueis.rows)

    } catch (err) {
        res.staus(500).send(err.message)
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body

    try {

        const nameCustomer = await db.query(`
            SELECT name FROM customers WHERE id=${customerId}
        `)

        const nameGame = await db.query(`
            SELECT name FROM games WHERE id=${gameId}
        `)

        const priceGame = await db.query(`
            SELECT "pricePerDay" FROM games WHERE id=${gameId}
        `)
        console.log(nameGame.rows[0])

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate",
            "originalPrice", "delayFee", "customer", game)
            VALUES ('${customerId}','${gameId}','${dayjs().format('YYYY-MM-DD')}',
            '${daysRented}','2000-02-03',${daysRented * priceGame.rows[0].pricePerDay},2, 
            '${nameCustomer.rows[0].name}', ${nameGame.rows[0].name})    
        ;`)

        res.statusSend(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}