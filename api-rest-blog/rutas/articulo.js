const {
    Router
} = require("express") // Requerimos el módulo Router de exprees, el cual usaremos para definir rutas modulables
const multer = require("multer") //Requerimos multer para manejar subidas de archivos

const router = Router() // Activamos router para poder exportar las rutas modulables


const almacenamiento = multer.diskStorage({ //Con esta función definimos como y donde se almacenaran los archivos
    destination: function (req, file, cb) {
        cb(null, './imagenes/articulos') //Destino
    },

    filename: function (req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname) //Nombre del archivo
    }
})

const subidas = multer({ //Activamos multer y le pasamos "almacenamiento" para que configure a través de este middleware el almacenamiento de los archivos que trate
    storage: almacenamiento
})


const articuloControlador = require("../controladores/articulo.js") //Cargamos todos los controladores de /controladores/articulo.js


router.get("/ruta-de-prueba", articuloControlador.prueba) //Define una ruta GET /ruta-de-prueba que llama a la función prueba del controlador.
router.get("/usuario", articuloControlador.user) //Ruta GET /usuario que llama a la función user.
router.post("/crear", articuloControlador.crear) //Ruta POST /crear que llama a la función crear para crear un nuevo artículo.
router.get("/articulos/", articuloControlador.listar) // Ruta GET / articulos / que llama a la función listar para obtener todos los artículos o los últimos N según query.
router.get("/articulo/:id", articuloControlador.uno) //Ruta GET /articulo/:id que llama a la función uno para obtener un artículo específico por su id.
router.delete("/articulo/:id", articuloControlador.borrar) //Ruta DELETE /articulo/:id que llama a la función borrar para eliminar un artículo por su id.
router.put("/articulo/:id", articuloControlador.editar) //Ruta PUT /articulo/:id que llama a la función editar para actualizar un artículo por su id.
router.post("/subir-imagen/:id", [subidas.single("file0")], articuloControlador.subir) // Ruta que usa un middleware para recibir un archivo a traves de "file0" y asocia la imagen al artículo.
router.get("/imagen/:fichero", articuloControlador.imagen) //Ruta GET /imagen/:fichero que llama a la función imagen para enviar al cliente un archivo de imagen desde el servidor.
router.get("/buscar/:busqueda", articuloControlador.buscador) //Ruta GET /buscar/:busqueda que llama a la función buscador para buscar artículos que contengan la cadena proporcionada en título o contenido.




module.exports = router //Exportamos el Router