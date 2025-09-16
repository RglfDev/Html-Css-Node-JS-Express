const User = require("../models/user") //Requerimos el modelo de la base de datos 
const bcrypt = require("bcrypt") //Requerimos "bcrypt" para poder cifrar las contraseñas


const registerUser = async (req, res) => { //Función de registro de usuario en la base de datos
    console.log("REQ BODY:", req.body); //Bandera para comprobar qué nos llega desde la petición (aquí llegan los datos ingresados por el usuario en los campso de texto)
    try {
        const { //Igualamos cada campo recibido en el body con los campso del Schema de la base de datos para poder guardarlo correctamente
            userName,
            userSurname,
            nickName,
            password,
            email
        } = req.body

        const verifyNick = await User.findOne({ //Comprobamos que el nickName no exista ya en otro usuario de la BBDD
            nickName
        })
        if (verifyNick) {
            return res.status(400).json({ //Si existe, lanzamos un error
                message: "El nick ya está en uso"
            })
        }

        const verifyEmail = await User.findOne({
            email
        })

        if (verifyEmail) {
            return res.status(400).json({ //Si existe, lanzamos un error
                message: "El email ya está registrado"
            })
        }

        const hashPass = await bcrypt.hash(password, 10) //Hasheamos la contraseña al nivel 10 (un numero mayor implicaría mas tiempo de procesado de la pass)

        const newUser = new User({ //Creamos el objeto newUser con la contraseña hasheada y según el Schema construido
            userName,
            userSurname,
            nickName,
            password: hashPass,
            email,
        })

        await newUser.save() //Guardamos el objeto en la base de datos

        res.status(200).json({ //Mandamos un mensaje de éxito al guardarlo
            message: "El usuario ha sido registrado correctamente"
        })
    } catch (error) {
        res.status(500).json({ //Si hay algún fallo de registro, se manda el correspondiente mensaje de error
            message: "Error al registrar usuario",
            error: error.message
        })
    }
}


/* const loginUser = async(req,res) */


module.exports = registerUser //Exportamos en controlador para poder utilizarlo desde el router