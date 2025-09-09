/*
Este fichero se encarga de construir un modelo el cual servirá de plantilla para ir guardando documentos en la BBDD
*/

const {
    Schema,
    model
} = require("mongoose")

const articuloSchema = Schema({ //Definición del esquema
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
})


module.exports = model("articulo", articuloSchema, "articulos") //Al exportarlo, en los parámetros del modelo indicamos (nombre,el esquema de donde cogemos la plantilla, colección)