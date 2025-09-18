const mongoose = require("mongoose") //Requerimos Mongoose para tratar con MongoDB
const config = require("config")


const uri = config.get("configDB.HOST")
console.log("Conectando a:", uri)
const connection = async () => { //Función asíncrona de conexión
    try {

        await mongoose.connect(config.get("configDB.HOST")) //Pasamos la ruta de conexión a la BBDD
        console.log("Conexión con la base de datos establecida")

    } catch (error) {

        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}

module.exports = { //Exportamos la conexión
    connection
}