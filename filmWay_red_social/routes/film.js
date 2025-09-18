const express = require("express")
const auth = require("../middleware/auth.js")
const {
    loadFilms,
    filmsByGenre,
    searchFilm
} = require("../controller/film")
const router = express.Router()



router.get("/popular", auth, loadFilms)
router.get("/genre", auth, filmsByGenre)
router.get("/search", auth, searchFilm)


module.exports = router