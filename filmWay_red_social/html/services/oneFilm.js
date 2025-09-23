const params = new URLSearchParams(window.location.search)
const id = params.get("id")
const commentText = document.querySelector(".commentText")
const btnSubmit = document.querySelector(".submit")
const warningText = document.querySelector(".warningText")
const template = document.querySelector(".commentTemplate")
const fragment = document.createDocumentFragment()



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
    document.getElementById("dateFilm").innerHTML = `<strong>Fecha de lanzamiento:</strong> ${data.release_date}`
    document.getElementById("durationFilm").innerHTML = `<strong>Duración:</strong> ${data.runtime} min`
    document.getElementById("descriptionFilm").textContent = data.overview
    const genres = data.genres.map(item => item.name).join(", ");
    document.getElementById("genresFilm").innerHTML = `<strong>Géneros:</strong> ${genres}`;

}

btnSubmit.addEventListener("click", () => {

    const commentContent = commentText.value

    saveComment(commentContent, id)

})

async function saveComment(commentContent, id) {

    const token = getToken()

    if (commentContent == "") {

        warningText.style.visibility = "visible"

    } else {
        warningText.style.visibility = "hidden"
        try {

            const res = await fetch("/api/films/addComment", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    filmId: id,
                    comment: commentContent
                })
            })

            if (!res.ok) {

                console.error("Error al guardar comentario");

            } else {

                console.log("Comentario guardado con éxito");

                const data = await res.json()
                buildComments(data.comment)
                commentText.value = ""
            }

        } catch (error) {
            console.log(error)
        }


    }
}

async function showComments() {

    const token = getToken()

    const res = await fetch(`/api/films/showComments/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const data = await res.json()

    console.log(data.comments)

    data.comments.forEach(comment => {

        buildComments(comment)

    });



}

function buildComments(comment) {

    const clone = template.content.cloneNode(true)
    const userName = clone.querySelector(".userName")
    const commentContent = clone.querySelector(".commentContent")
    const dateComment = clone.querySelector(".dateComment")

    userName.textContent = comment.userNick
    commentContent.textContent = comment.userComment

    const d = new Date(comment.dateComment)
    const day = d.getDate()
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    const month = monthNames[d.getMonth()]
    const year = d.getFullYear()

    dateComment.textContent = `Publicado el ${day} de ${month} de ${year}`

    document.querySelector(".comments").appendChild(clone)
}


showOneFilm()
showComments()