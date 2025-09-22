const express = require("express")
const auth = require("../middleware/auth.js")
const {
    loadFilms,
    filmsByGenre,
    searchFilm,
    oneFilm
} = require("../controller/film")
const router = express.Router()



router.get("/popular", auth, loadFilms)
router.get("/genre", auth, filmsByGenre)
router.get("/search", auth, searchFilm)
router.get("/oneFilm/:id", auth, oneFilm)


module.exports = router