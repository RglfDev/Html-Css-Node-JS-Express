const template = document.querySelector(".template")
const fragment = document.createDocumentFragment()
const main = document.querySelector(".main")
const typeSelector = document.querySelector(".typeSelector")
const inputFilm = document.querySelector(".inputFilm")
const btnSearch = document.querySelector(".btnSearch")

const apiKey = "e30c1ae43fe34f0a90b23ecb086b8571"
let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`

const filmList = []

async function connection() {

    const res = await fetch(url)
    const data = await res.json()

    console.log(data)

    data.results.forEach(film => {

        const filmObject = {
            id: film.id,
            img: film.poster_path,
            title: film.title
        }

        filmList.push(filmObject)
        createFragment(filmObject)

    })

    main.appendChild(fragment)

}

function createFragment(filmObject) {
    const clone = template.content.cloneNode(true)
    const card = clone.querySelector(".filmContainer")
    const fTitle = clone.querySelector(".filmTitle")
    const fImg = clone.querySelector(".filmImg")
    const fComments = clone.querySelector(".filmComments")
    const fAddBtn = clone.querySelector(".filmAddButton")

    fComments.textContent = "Comentarios : 0"

    fTitle.textContent = filmObject.title
    fImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${filmObject.img}`)

    fragment.appendChild(clone)
}

typeSelector.addEventListener("change", () => {
    inputFilm.value = ""
    main.innerHTML = ""
    fragment.innerHTML = ""

    const genre = typeSelector.value

    if (genre === "") {
        // Si se selecciona "Todos", usamos popular
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`
    } else {
        // Filtrar por género
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=es-ES&page=1`
    }

    connection()

})

async function searchAllPages(query) {
    main.innerHTML = ""
    fragment.innerHTML = ""

    const allResults = []
    let page = 1
    let totalPages = 1

    do {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`
        )
        const data = await res.json()
        allResults.push(...data.results)
        totalPages = data.total_pages
        page++
    } while (page <= totalPages)

    allResults.forEach(film => {
        const filmObject = {
            id: film.id,
            img: film.poster_path,
            title: film.title
        }
        createFragment(filmObject)
    })

    main.appendChild(fragment)
}


btnSearch.addEventListener("click", () => {
    const value = inputFilm.value.trim()
    if (value) {
        searchAllPages(value)
    }
})


connection()