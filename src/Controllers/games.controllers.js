import { db } from "../Database/database.js"

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games`)
        //const games = await db.query(`Delete FROM games`)
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body


    try {
        const conflit = await db.query(
            `SELECT * FROM games 
            WHERE name= '${name}';`
        )

        if (conflit.rows[0]) return res.status(409).send("Jogo ja cadastrada")

        await db.query(`
        INSERT INTO games (name, image, stockTotal, pricePerDay)
            VALUES ('${name}', '${image}', '${stockTotal}', '${pricePerDay}');`
        )
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}