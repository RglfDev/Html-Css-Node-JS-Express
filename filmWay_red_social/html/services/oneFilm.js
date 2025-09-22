const params = new URLSearchParams(window.location.search)
const id = params.get("id")


function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
    }
    return token;
}


async function showOneFilm() {

    const token = getToken()

    const res = await fetch(`/api/films/oneFilm/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })


    const data = await res.json()

    console.log("Datos recibidos:", data)

    document.getElementById("title").textContent = data.title;
    document.getElementById("imgFilm").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;


}


showOneFilm()