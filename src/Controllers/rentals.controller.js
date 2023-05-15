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

        const priceGame = await db.query(`
            SELECT "pricePerDay" FROM games WHERE id=${gameId}
        `)

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate",
            "originalPrice", "delayFee")
            VALUES ('${customerId}','${gameId}','${dayjs().format('YYYY-MM-DD')}',
            '${daysRented}',${null},${daysRented * priceGame.rows[0].pricePerDay},${null})    
        ;`)

        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}