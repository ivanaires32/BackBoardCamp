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

        const games = await db.query(`SELECT "stockTotal" FROM games
        WHERE id=${gameId};`)

        const disponivel = await db.query(`
            SELECT "gameId" FROM rentals
        `)

        if (disponivel.rows.length > games.rows[0].stockTotal) return res.sendStatus(400)

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

export async function returnRentals(req, res) {
    const { id } = req.params
    try {

        const diaAtual = dayjs()
        const buyDay = await db.query(`
            SELECT "rentDate" FROM rentals WHERE id=$1;
        `, [id])

        const d = dayjs(buyDay.rows[0].rentDate).format('DD-MM-YYYY')

        const delay = Number(diaAtual.format('DD-MM-YYYY')[0] + diaAtual.format('DD-MM-YYYY')[1]) - Number(d[0] + d[1])

        const originalPrice = await db.query(`
            SELECT "originalPrice" FROM rentals WHERE id=$1;
        `, [id])
        await db.query(`
            UPDATE rentals SET "returnDate"='${diaAtual.format('YYYY-MM-DD')}'
            WHERE id=$1;
        `, [id])

        await db.query(`
            UPDATE rentals SET "delayFee"=${delay * originalPrice.rows[0].originalPrice}
            WHERE id=$1;
        `, [id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}