const {
    conexion
} = require("./basedatos/conexion") //Traemos la función de la conexión a la BBDD
const express = require("express") //Requerimos Express
const cors = require("cors")
const rutasArticulo = require("./rutas/articulo")



conexion() //Iniciamos la conexión a la BBDD
const app = express() //Instanciamos express

app.use(cors()) //Con cors permitimos que se puedan permitir peticiones a la API desde otros sitios
app.use(express.json()) // Para parsear a objetos JSON
app.use(express.urlencoded({
    extended: true
})) //Para parsear datos que vienen desde formularios a JSON para que sean legibles


app.use("/api", rutasArticulo) //Creamos una ruta por la que pasaran todos los Routers o rutas que hemos creado en "rutas/articulo.js"



app.listen(3000) //Iniciamos el Server