const express = require("express")
const path = require("path")
const {
    connection
} = require("../database/connection.js") //Traemos el módulo de la conexión a la base de datos
const auth = require("../middleware/auth.js")
const userRoutes = require("../routes/user.js") //Requerimos el router configurado para la creación de usuarios
const authRoutes = require("../routes/auth.js") //Requerimos el router de autenticación para los token



const app = express() //Inicializamos express

connection() //Realizamos la conexión con la base de datos 

app.use(express.json()) //Setting para configurar y permitir poder leer en formato JSON


app.use(express.static(path.join(__dirname, "../html"))); //Ruta para poder mostrar los ficheros de la carpeta html
app.use("/services", express.static(path.join(__dirname, "../services"))); //Ruta para poder acceder a los ficheros de servicio (Javascript)
app.use("/home", express.static(path.join(__dirname, "../home")))

/* Ruta para cargar la página de login*/
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/login.html"));
});

/*Ruta para cargar la página de registro de nuevo usuario*/
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/register.html"))
})

/*Ruta para poder acceder a las acciones de creación de nuevo usuario. Accedemos al router configurado de este mismo*/
app.use("/api/users", userRoutes)



app.listen(3000) //Servidor escuchando en el puerto 3000
console.log("Server on port 3000")