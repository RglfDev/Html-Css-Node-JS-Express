const template = document.querySelector(".template")
const fragment = document.createDocumentFragment()
const main = document.querySelector(".main")
const typeSelector = document.querySelector(".typeSelector")
const inputFilm = document.querySelector(".inputFilm")
const btnSearch = document.querySelector(".btnSearch")


let url = `/api/films/popular?page=1`

const filmList = []

function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
    }
    return token;
}

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

    console.log(data.results)

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