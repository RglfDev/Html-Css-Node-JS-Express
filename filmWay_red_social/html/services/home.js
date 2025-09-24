import {
    logOutUser,
    getToken
}
from "../services/token_services.js"

const template = document.querySelector(".template")
const fragment = document.createDocumentFragment()
const main = document.querySelector(".main")
const typeSelector = document.querySelector(".typeSelector")
const inputFilm = document.querySelector(".inputFilm")
const btnSearch = document.querySelector(".btnSearch")
const btnLogout = document.querySelector("#btnLogout")



let url = `/api/films/popular?page=1`

const filmList = []


async function connection() {

    const token = getToken()

    if (!token) {
        console.log("Debes volver a loguearte")
        window.location.href = "/login.html"
        return

    }

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
    }

    const data = await res.json()

    const favoriteFilms = await getUserFavorites()

    if (!data.results || data.results.length === 0) {
        console.warn(" No se recibieron películas")
        main.innerHTML = "<h1>Sin resultados</h1>"
        return;
    }

    console.log(data.results)

    data.results.forEach(film => {

        const filmObject = {
            id: film.id,
            img: film.poster_path,
            title: film.title
        }

        filmList.push(filmObject)
        createFragment(filmObject, favoriteFilms)

    })

    main.appendChild(fragment)

}

async function createFragment(filmObject, favoriteFilms) {
    const clone = template.content.cloneNode(true)
    const card = clone.querySelector(".filmContainer")
    const fTitle = clone.querySelector(".filmTitle")
    const fImg = clone.querySelector(".filmImg")
    const fComments = clone.querySelector(".filmComments")
    const fAddBtn = clone.querySelector(".filmAddButton")
    const ffilmBtn = clone.querySelector(".filmButton")


    fTitle.textContent = filmObject.title
    fTitle.style.fontWeight = "bold"
    fImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${filmObject.img}`)

    fAddBtn.dataset.filmId = filmObject.id

    ffilmBtn.dataset.filmId = filmObject.id

    ffilmBtn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.filmId
        window.location.href = `/oneFilm.html?id=${id}`
    })



    const isFavorite = favoriteFilms.some(favId => favId == filmObject.id)

    if (isFavorite) {

        fAddBtn.textContent = "En tu lista"
        fAddBtn.disabled = true

    } else {

        fAddBtn.addEventListener("click", (e) => {

            const filmIdBtn = e.target.dataset.filmId
            addFilmToUser(filmIdBtn, fAddBtn)

        })

    }

    fragment.appendChild(clone)
}

typeSelector.addEventListener("change", () => {


    inputFilm.value = ""
    main.innerHTML = ""
    fragment.innerHTML = ""

    const genre = typeSelector.value

    if (genre === "") {
        // Si se selecciona "Todos", usamos popular
        url = `/api/films/popular?page=1`
    } else {
        // Filtrar por género
        url = `/api/films/genre?genre=${genre}&page=1`
    }

    connection()

})

async function searchAllPages(query) {

    const token = getToken()

    main.innerHTML = ""
    fragment.innerHTML = ""

    const allResults = []
    let page = 1
    let totalPages = 1

    const favoriteFilms = await getUserFavorites()

    do {
        const res = await fetch(`/api/films/search?query=${encodeURIComponent(query)}&page=${page}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }

        })

        if (res.status === 401) { // Token inválido o caducado
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

        const data = await res.json()
        allResults.push(...data.results)
        totalPages = data.total_pages
        page++
    } while (page <= totalPages)

    if (allResults.length === 0) {
        main.innerHTML = "<h2>Sin resultados</h2>"
        return
    }

    allResults.forEach(film => {
        const filmObject = {
            id: film.id,
            img: film.poster_path,
            title: film.title
        }
        createFragment(filmObject, favoriteFilms)
    })

    main.appendChild(fragment)
}


btnSearch.addEventListener("click", () => {
    const value = inputFilm.value.trim()
    if (value) {
        searchAllPages(value)
    }
})


async function addFilmToUser(filmId, btn) {

    const token = getToken()

    try {
        const res = await fetch("/api/users/addFilm", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                filmId
            })
        })

        const data = await res.json()

        btn.textContent = "En tu lista"
        btn.disabled = true

        console.log(data.message)

    } catch (error) {
        console.log("Error al intentar añadir la película a favoritos")
    }


}

async function getUserFavorites() {
    const token = getToken()
    try {
        const res = await fetch("/api/users/fav", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await res.json()
        return data.films || []
    } catch (error) {
        console.log("Error al intentar obtener favoritos del usuario")
        return []
    }
}


btnLogout.addEventListener("click", (e) => {
    e.preventDefault();
    logOutUser();
});
connection()