const userNick = document.querySelector(".userNick")
const userName = document.querySelector(".userName")
const userEmail = document.querySelector(".userEmail")
const userDate = document.querySelector(".userDate")
const templateCards = document.querySelector(".templateCards")
const containerCards = document.querySelector(".containerCards")


function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
    }
    return token;
}

async function showUserData() {

    const token = getToken()

    const res = await fetch("/api/users/profile", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const data = await res.json()

    const user = data.userData

    userName.textContent = `${user.userName} ${user.userSurname}`
    userNick.textContent = user.nickName
    userEmail.textContent = user.email
    const date = new Date(user.registerDate)
    userDate.textContent = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })


    console.log(user.films)
    showFavs(user.films)


}


async function showFavs(arrayId) {

    const token = getToken()

    containerCards.innerHTML = ""

    for (const item of arrayId) {


        const res = await fetch(`/api/users/showFavs/${item}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()


        const clone = templateCards.content.cloneNode(true)
        const filmTitle = clone.querySelector(".filmTitle")
        const filmButton = clone.querySelector(".filmButton")
        const filmImg = clone.querySelector(".filmImg")

        filmTitle.textContent = data.title
        filmImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${data.poster_path}`)

        filmButton.dataset.filmId = data.id
        filmButton.addEventListener("click", () => {
            window.location.href = `/oneFilm.html?id=${data.id}`
        })

        containerCards.appendChild(clone)


    }

}

showUserData()