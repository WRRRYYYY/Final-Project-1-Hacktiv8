const pool = require("../config/db");
const { hashPassword } = require('../helpers/bcrypt')

const User = {
    async create(email, password) {
        const query = `
        INSERT INTO users(email, password)
        VALUES($1, $2)
        RETURNING *`

        const hashedpassword = hashPassword(password)

        const values = [email, hashedpassword]
        const { rows } = await pool.query(query, values)

        return rows[0]
    },

    async checkAccount(email) {
        const query = `
        SELECT * FROM users
            WHERE email = $1`

        const value = [email]
        const { rows } = await pool.query(query, value)
        return rows[0]
    }

}

module.exports = User