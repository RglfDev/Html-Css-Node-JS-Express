/*
Fichero de configuración de la conexión a la BBDD*/


const mongoose = require('mongoose') //Requerimos mongoose para poder realizar la conexión con la BBDD

const conexion = async () => { //Función asíncrona para realizar la conexión
    try {

        await mongoose.connect("mongodb://localhost:27017/mi_blog") //Ruta donde conectamos a la base de datos de MongoDB

        console.log("Conectado correctamente a la base de datos: mi_blog")

    } catch (error) { //catch para capturar el error en caso de que falle la conexión
        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}


module.exports = { //Exportamos la función de la conexión para utilizarla despues en nuestro fichero principal
    conexion
}