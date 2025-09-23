const express = require("express")
const config = require("config")
const Comments = require("../models/comments")

const apiKey = config.get("apiKey.KEY")
console.log(apiKey)

async function loadFilms(req, res) {


    try {
        const page = req.query.page || 1
        console.log(page)

        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${page}`
        const response = await fetch(url)

        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Error desde TMDB'
            })
        }

        const data = await response.json()

        if (!data.results) {
            return res.status(500).json({
                message: 'Datos inválidos de TMDB'
            })
        }

        res.json(data)
    } catch (error) {
        return res.status(500).json({
            message: "No se ha podido conectar a la API",
            error: error.message
        })
    }
}


async function filmsByGenre(req, res) {
    try {

        const {
            genre,
            page = 1
        } = req.query

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=es-ES&page=${page}`
        const response = await fetch(url)
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Error desde TMDB'
            })
        }

        const data = await response.json()

        if (!data.results) {
            return res.status(500).json({
                message: 'Datos inválidos de TMDB'
            })
        }
        res.json(data)

    } catch (error) {
        return res.status(500).json({
            message: "No se ha podido conectar a la API",
            error: error.message
        })
    }

}


async function searchFilm(req, res) {

    try {

        const query = req.query.query
        const page = req.query.page || 1

        if (!query) {
            return res.status(400).json({
                message: "Se debe proporcionar parámetros de búsqueda"
            })
        }

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`;
        console.log("URL construida:", url);

        const response = await fetch(url)
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Error desde TMDB'
            })
        }

        const data = await response.json()

        if (!data.results) {
            return res.status(500).json({
                message: 'Datos inválidos de TMDB'
            })
        }

        res.json(data)

    } catch (error) {
        return res.status(500).json({
            message: "No se ha podido conectar a la API",
            error: error.message
        })
    }
}

async function oneFilm(req, res) {

    try {

        const filmId = req.params.id

        const response = await fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=es-ES`)

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Error al obtener la película"
            });
        }

        const data = await response.json()

        res.json(data)

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }

}

async function addComment(req, res) {

    try {

        const {
            filmId,
            comment
        } = req.body

        const nickName = req.user.nick

        if (!filmId || !comment) {
            return res.status(400).json({
                message: "Faltan parámetros"
            })
        }

        const newComment = {
            userNick: nickName,
            userComment: comment,
            dateComment: new Date()
        }

        const existFilm = await Comments.findOne({
            filmId
        })

        if (existFilm) {

            existFilm.comments.push(newComment)
            await existFilm.save()

            res.status(200).json({
                message: "El comentario ha sido guardado con éxito",
                comment: newComment
            })

        } else {

            const newDocFilmComment = new Comments({
                filmId: filmId,
                comments: [newComment]
            })

            await newDocFilmComment.save()

            return res.status(200).json({
                message: "Documento creado y comentario guardado"
            })

        }
    } catch (error) {

        console.log("Error al guardar el comentario en la BBDD", error)

        return res.status(500).json({
            message: "Error al guardar el comentario en la BBDD",
            error: error.message
        })
    }
}

async function showComments(req, res) {

    try {

        const {
            filmId
        } = req.params;

        if (!filmId) {
            res.status(400).json({
                message: "No se ha encontrado un ID de pelicula en la request"
            })
        }

        const existFilm = await Comments.findOne({
            filmId
        })

        if (existFilm) {

            return res.status(200).json({
                message: "Pelicula encontrada",
                comments: existFilm.comments
            })

        } else {

            return res.status(500).json({
                message: "No se encuentran comentarios con ese ID de pelicula"
            })

        }




    } catch (error) {
        return res.status(500).json({
            message: "Error del servidor al buscar ID para comentarios",
            error: error.message
        })
    }

}




module.exports = {
    loadFilms,
    filmsByGenre,
    searchFilm,
    oneFilm,
    addComment,
    showComments
}