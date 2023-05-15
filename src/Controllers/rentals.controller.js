import dayjs from "dayjs"
import { db } from "../Database/database.js"


export async function getRentals(req, res) {
    try {
        const alugueis = await db.query(`
            SELECT * FROM rentals
        `)

        let clientAluguel
        let gameAluguel

        for (let i = 0; i < alugueis.rows.length; i++) {
            const customerAluguel = await db.query(`
               SELECT * FROM customers WHERE id=${alugueis.rows[i].customerId}
            `)

            if (customerAluguel) clientAluguel = customerAluguel
        }

        for (let i = 0; i < alugueis.rows.length; i++) {
            const jogoAluguel = await db.query(`
               SELECT * FROM games WHERE id=${alugueis.rows[i].gameId}
            `)

            if (jogoAluguel) gameAluguel = jogoAluguel
        }

        for (let i = 0; i < alugueis.rows.length; i++) {
            alugueis.rows[i] = {
                ...alugueis.rows[i],
                customer: { id: clientAluguel.rows[0].id, name: clientAluguel.rows[0].name },
                game: { id: gameAluguel.rows[0].id, name: gameAluguel.rows[0].name }
            }

        }

        res.send(alugueis.rows)

    } catch (err) {
        res.status(500).send(err.message)
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