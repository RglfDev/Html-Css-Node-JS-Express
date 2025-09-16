/**
 * Archivo que define la ruta por la que se harán las acciones de guardado de nuevos usuarios "/api/users/register"
 */

const express = require("express")
const router = express.Router() //Generamos la instancia del router
const registerUserController = require("../controller/user") //Requerimos el controlador de registro
const loginUserController = require("../controller/login")

router.post("/register", registerUserController) //Montamos la ruta completa desde la que accederá el servidor, indicando el acceso ("/register") y el controlador que hará el guardado de usuario

router.post("/login", loginUserController)

module.exports = router //Exportamos el router para que pueda ser accedido por el servidor