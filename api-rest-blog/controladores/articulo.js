/*
Fichero que controlará las peticiones del usuario y las respuestas del servidor en las rutas determinadas
*/

const validator = require("validator") //Requerimos "validator" para usarlo despues en la validación de campos
const Articulo = require("../modelos/articulo") // Carga el modelo de mongoose de la Base de Datos (Schema, nombre y ruta)
const path = require("path") //Requerimos "path" para manejar rutas de archivos
const fs = require("fs") //Requerimos "fs" para trabajar leer y trabajar con ficheros


const prueba = (req, res) => { //Función de prueba para comprender el funcionamiento de las respuestas en Json
    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de articulos"
    })
}

const user = (req, res) => { //Función que devuelve un objeto Json con datos de un usuario
    return res.status(200).json({

        nombre: "Ruben",
        apellido: "Gomez",
        edad: 35
    })
}

const crear = async (req, res) => { // Función para crear un post

    //Recoger parametros por post a guardar
    let parametros = req.body //Obtiene los datos enviados en el POST por el usuario

    //validar datos
    try {

        validacionCampos(parametros) //Función que valida el título y el contenido escritos por el user

        //Crear el objeto a guardar
        const articulo = new Articulo(parametros) //Creamos un objeto con el modelo de mongoose

        //Guardar el articulo en la BBDD
        const articuloGuardado = await articulo.save() //Guardamos el artículo en la BBDD


        return res.status(200).json({ //Devolvemos una respuesta satisfactoria en json
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito!!"
        })

    } catch (error) { //Si hay algún error, lanzamos la excepción
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        })
    }

}

const listar = async (req, res) => { //Función para listar artículos (todos o los últimos)
    try {

        let ultimos = parseInt(req.query.ultimos) || 0 // Guardamos la query contenida en la url (nº)

        const consulta = Articulo //Creamos la consulta ordenando lso resultados por fecha descendente
            .find({})
            .sort({
                fecha: -1
            });

        if (ultimos > 0) { //Si hay resultados, limita los resultados obtenidos al parametro introducido en la url
            consulta.limit(ultimos)
        }

        let articulos = await consulta //ejecuta la consulta y obtiene el array


        if (!articulos || articulos.length === 0) { // Si no hay resultados, lanzamos el mensaje de error
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).json({ // Si todo va bien, mostramos el Json con los resultados de la búsqueda
            status: "success",
            parametro: req.query.ultimos,
            contador: articulos.length,
            articulos
        });

    } catch (error) { // Si hay un error al realizar la consulta, lanzamos la excepción
        return res.status(500).json({
            status: "error",
            mensaje: "Error en la consulta",
            error: error.message
        });
    }
};

const uno = async (req, res) => { // Función para ver un artículo en particular

    try {

        let id = req.params.id //Leemos el parametro :id de la url

        const articulo = await Articulo.findById(id) //Búscamos el documento por el id de la url

        if (!articulo || articulo.length === 0) { // Si no hay documentos, mandamos un mensaje de error
            res.status(400).json({
                status: "error",
                mensaje: "No se han encontrado resultados con ese ID"
            })
        }

        return res.status(200).json({ //Si la búsqueda es satisfactoria, mostramos el resultado
            status: "success",
            parametro: req.params.id,
            contador: articulo.length,
            articulo
        })

    } catch (error) { //Si hay errores al realizar la búsqueda, lanzamos la excepción
        return res.status(500).json({
            status: "error",
            mensaje: "Error en la consulta",
            error: error.message
        });
    }

}

const borrar = async (req, res) => { //Función para borrar artículos

    try {
        let articulo_id = req.params.id // Recogemos el parámetro :id de la url

        const articuloBorrado = await Articulo.findOneAndDelete({ // Realizamos una búsqueda y borrado del documento que contenga dicho ID
            _id: articulo_id
        })

        if (!articuloBorrado) { // Si no encuentra el documento, mandamos un mensaje de error
            return res.status(400).json({
                status: "Error",
                mensaje: "No se encuentra el artículo para borrarlo"
            })
        }

        return res.status(200).json({ //Si lo encuentra, mandamos un mensaje de Ok
            status: "success",
            mensaje: "Documento borrado con éxito",
            articulo: articuloBorrado
        })

    } catch (error) { //Si hay errores al realizar la búsqueda, lanzamos la excepción
        return res.status(500).json({
            status: "error",
            mensaje: "Error en la consulta",
            error: error.message
        });
    }
}

const editar = async (req, res) => { // Función para editar artículos
    try {
        let articuloId = req.params.id // Recogemos el parámetro :id de la url

        let parametros = req.body //Recogemos el body o campo que el usuario ha introducido para cambiar
        try {

            validacionCampos(parametros) //Lo pasamos por la validación

        } catch (error) { //Si sale alguna excepción a la hora de recoger los datos, lo capturamos
            return res.status(400).json({
                status: "error",
                mensaje: "faltan datos por enviar"
            })
        }

        const articuloActualizado = await Articulo.findOneAndUpdate({ //Función de búsqueda y actualizado de un documento
            _id: articuloId
        }, parametros, {
            new: true
        })

        if (!articuloActualizado) { //Si no encuentra el documento, avisamos con un Json al cliente
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al actualizar"
            })
        }

        return res.status(200).json({ //Si lo encuentra, avisamos con un status satisfactorio
            status: "success",
            articulo: articuloActualizado
        })
    } catch (error) { //Si hay errores al realizar la búsqueda, lanzamos la excepción
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }


}

const subir = async (req, res) => { // Función para subir una imagen a un artículo
    //configurar multer => fichero "/rutas/articulo.js"

    //Recoger fichero
    if (!req.file && !req.files) { //Comprobamos que exista el archivo 
        return res.status(400).json({ // Si no está, mostramos un mensaje de error
            status: "error",
            mensaje: "Petición inválida"
        })
    }
    //Nombre del archivo

    let nombreArchivo = req.file.originalname //Revogemos el nombre del archivo

    //Extension del archivo

    let archivo_split = nombreArchivo.split("\.")
    let extensionArchivo = archivo_split[1] //Separamos el nombre de la extensión y nos quedamos con la segunda parte (la extensión)

    //Comprobar extension correcta

    if (extensionArchivo != "png" && extensionArchivo != "jpg" && extensionArchivo != "jpeg" && extensionArchivo != "gif") { //Si no es ninguno de los formatos anteriores, hay que evitar que se quede guardado

        fs.unlinkSync(req.file.path) //Si hay algún fallo en el proceso, borramos la imagen del directorio ya que, aunque no finalice el proceso, esta se guarda igualmente
        return res.status(400).json({
            status: "error",
            mensaje: "Archivo inválido"
        })

    }

    //Si todo va bien, actualiza el articulo con la imagen
    let articuloId = req.params.id //Recogemos el :id de la url

    const articuloActualizado = await Articulo.findOneAndUpdate({ //Función de búsqueda y actualizado de un documento
        _id: articuloId
    }, {
        imagen: req.file.filename
    }, {
        new: true
    })

    if (!articuloActualizado) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error al actualizar"
        })
    }

    return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        fichero: req.file
    })

}

const imagen = async (req, res) => { //Función para mostrar o descargar una imagen guardada
    let fichero = req.params.fichero //Recogemos el nombre del fichero de la url
    let ruta_fichero = "./imagenes/articulos/" + fichero ////Construye la ruta local del fichero

    fs.stat(ruta_fichero, (error, existe) => { //Comprobamos si el archivo existe
        if (existe) {
            return res.sendFile(path.resolve(ruta_fichero)) //Si existe, enviamos el archivo encontrado como respuesta al cliente
        } else {
            res.status(404).json({ //Si no, mandamos un error
                status: "error",
                mensaje: "La imagen no existe"
            })
        }
    })
}

const buscador = async (req, res) => { //Función para buscar artículos por palabras determinadas

    let busqueda = req.params.busqueda //Recogemos el parámetro de la url

    const consulta = await Articulo.find({ //Hacemos una consulta a Mongo con $or (para buscar en titulo o contenido) y con $regex, para omitir mayúsculas y minúsculas
            "$or": [{
                    "titulo": {
                        "$regex": busqueda,
                        "$options": "i"
                    }
                },
                {
                    "contenido": {
                        "$regex": busqueda,
                        "$options": "i"
                    }
                },
            ]
        })
        .sort({
            fecha: -1
        })

    if (!consulta || consulta.length <= 0) { //Si no hay resultados, mandamos un mensaje de fallo
        return res.status(404).json({
            status: "Error",
            mensaje: "No se han encontrado coincidencias"
        })
    }

    return res.status(200).json({ //Si hay resultados, mandamos la consulta
        status: "Success",
        articulos: consulta
    })

}


function validacionCampos(parametros) { //Función para validar los campos de entrada de texto del usuario

    let validarTitulo = !validator.isEmpty(parametros.titulo) //Si el titulo no está vacio, lo coge de parámetros y lo valida
    let validarContenido = !validator.isEmpty(parametros.contenido) && validator.isLength(parametros.contenido, {
        min: 1,
        max: 500
    }) //Si el titulo no está vacio, lo coge de parámetros y lo valida


    if (!validarTitulo || !validarContenido) {
        throw new Error("No se ha podido validar la informacion")
    }
}


module.exports = { //Exportamos todos losendPoints para que puedan configurarse desde el fichero principal
    prueba,
    user,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}