const User = require("../models/userModel")
const pool = require("../config/db")
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController {
    static async register(req, res) {
        try {
            const { email, password } = req.body

            // Cek apakah email sudah terdaftar
            const dataEmail = await User.checkAccount(
                email
            )
            if (dataEmail) {
                return res.status(400).json({ message: "Email already registered!" })
            }

            const data = await User.create(
                email, password
            )

            const response = {
                id: data.id,
                email: data.email
            }
            res.status(201).json(response)
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            // Cek apakah email ada
            const dataAcc = await User.checkAccount(
                email
            )
            if (!dataAcc) {
                return res.status(404).json({ message: "Account not found!" })
            }

            // Cek Password
            const isCorrect = comparePassword(password, dataAcc.password)
            if (!isCorrect) {
                throw {
                    code: 401,
                    message: "Incorrect Password"
                }
            }

            // Generate Token
            const data = {
                id: dataAcc.id,
                email: dataAcc.email
            }
            const Token = generateToken(data)

            const response = {
                Token,
                message: "Login successful!"
            }

            res.status(200).json(response)
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
}

module.exports = UserController