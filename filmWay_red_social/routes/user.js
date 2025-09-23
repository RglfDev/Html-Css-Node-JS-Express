/**
 * Archivo que define la ruta por la que se harán las acciones de guardado de nuevos usuarios "/api/users/register"
 */

const express = require("express")
const auth = require("../middleware/auth.js")
const router = express.Router() //Generamos la instancia del router
const loginUserController = require("../controller/login")
const {
    registerUser,
    addFilmToFavorites,
    findUserFav,
    showUserData,
    showFavs
} = require("../controller/user")

router.post("/register", registerUser) //Montamos la ruta completa desde la que accederá el servidor, indicando el acceso ("/register") y el controlador que hará el guardado de usuario

router.post("/login", loginUserController)

router.put("/addFilm", auth, addFilmToFavorites)

router.get("/fav", auth, findUserFav)

router.get("/profile", auth, showUserData)

router.get("/showFavs/:id", auth, showFavs)

module.exports = router //Exportamos el router para que pueda ser accedido por el servidor