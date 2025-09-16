const User = require("../models/user") //Requerimos el modelo de la base de datos 
const bcrypt = require("bcrypt") //Requerimos "bcrypt" para poder cifrar las contraseñas

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body

        const user = await User.findOne({
            email
        }).select('+password')

        if (!user) {
            return res.status(400).json({
                message: "No se encuentra ese email"
            })

        } else {

            const bdPass = user.password

            const verifyPass = await bcrypt.compare(password, bdPass)

            if (!verifyPass) {
                return res.status(401).json({
                    message: "Contraseña incorrecta"
                })
            }

            return res.status(200).json({
                message: "Usuario verificado. Login correcto"
            })

        }

    } catch (error) {

        console.error('loginUser error:', error);

        return res.status(500).json({

            message: 'Error interno del servidor'

        });
    }
}

module.exports = loginUser