/**
 * Este fichero define el esquema de la colección Users en la base de datos
 */


const {
    Schema,
    model
} = require("mongoose") //Requerimos mongoose

const userSchema = Schema({ //Comenzamos la creación del esquema con los campos que queramos
    userName: { //Nombre del usuario
        type: String,
        required: true,
        unique: true
    },
    userSurname: { //Apellidos del usuario
        type: String,
        required: true
    },
    nickName: { //Nick del usuario
        type: String,
        required: true,
        unique: true
    },
    password: { //Contraseña del usuario
        type: String,
        required: true
    },
    email: { //Email del usuario
        type: String,
        required: true
    },
    image: { //Imagen del usuario (comenzará siendo por defeco una predefinida)
        type: String,
        default: "https://cdn-icons-png.freepik.com/256/9365/9365334.png"

    },
    registerDate: { //Fecha de alta del usuario en la base de datos
        type: Date,
        default: Date.now
    }
})


module.exports = model("User", userSchema, "users") //Exportamos el modelo indicando nombre - esquema - nombre de la colección en la BBDD