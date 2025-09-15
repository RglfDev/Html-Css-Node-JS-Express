const mongoose = require("mongoose") //Requerimos Mongoose para tratar con MongoDB


const connection = async () => { //Función asíncrona de conexión
    try {

        await mongoose.connect("mongodb://localhost:27017/filmWare") //Pasamos la ruta de conexión a la BBDD
        console.log("Conexión con la base de datos establecida")

    } catch (error) {

        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}

module.exports = { //Exportamos la conexión
    connection
}