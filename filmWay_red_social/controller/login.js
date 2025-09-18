const User = require("../models/user") //Requerimos el modelo de la base de datos 
const bcrypt = require("bcrypt") //Requerimos "bcrypt" para poder cifrar las contraseñas
const jwt = require("jsonwebtoken")
const config = require("config")

const loginUser = async (req, res) => { //Controlador para realizar la acción de login 

    try {
        console.log("REQ.BODY:", req.body) //Comprobación del body recibido
        const {
            email,
            password,
        } = req.body //Asignación de campos desde el body recibido



        const user = await User.findOne({ //Búsqueda del email en la base de datos y obtención de la contraseña
            email
        })

        console.log("Usuario buscado:", user)

        if (!user) { //Si no hay resultados en la búsqueda...
            return res.status(400).json({
                message: "No se encuentra ese email"
            })

        } else { //Si hay resultados...

            const bdPass = user.password //Capturamos la contraseña

            const verifyPass = await bcrypt.compare(password, bdPass) // Con bcrypt comprobamos que ambas contraseñas son idénticas

            if (!verifyPass) { //Si no coinciden las contraseñas, lanzamos un error
                return res.status(401).json({
                    message: "Contraseña incorrecta"
                })
            }

            console.log("Usuario encontrado:", user) //Comprobación por consola del usuario 

            const jwtoken = jwt.sign({
                data: {
                    id: user._id,
                    nick: user.nickName,
                    email: user.email
                }
            }, config.get("configToken.SEED"), {
                expiresIn: config.get("configToken.expiration")
            })


            return res.status(200).json({ //Si todo sale bien, mandamos respuesta
                message: "Usuario verificado. Login correcto",
                user: {
                    _id: user.id,
                    userName: user.userName,
                    nickName: user.nickName,
                    email: user.email,

                },
                token: jwtoken
            })

        }

    } catch (error) { //Si se rompe algún procedimiento en el try, pasamos al catch

        console.error('loginUser error:', error);

        return res.status(500).json({

            message: 'Error interno del servidor'

        });
    }
}

module.exports = loginUser