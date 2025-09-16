const ui = []
document.querySelectorAll("[id]").forEach(el => (ui[el.id] = el)) //Acción para capturar todos los elementos del html por su ID de golpe



btnLogin.addEventListener("click", async () => {

    console.log("Boton pulsado")

    const email = userInput.value
    const passUser = passInput.value

    if (email === "" || passUser === "") {

        warningText.textContent = "Debes rellenar ambos campos"
        warningText.style.color = "red"

    } else {

        console.log(email, passUser)

        const userData = {
            password: passUser,
            email: email,
        }

        const res = await fetch("api/users/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userData)
        })


        const data = await res.json()

        warningText.textContent = data.message; //...y las mostramos en el texto informativo de la página...
        warningText.style.color = res.ok ? "green" : "red"; //...con su correspondiente color indicando si es éxito o fallo

        console.log("Backend: ", data.message) //Bandera para comprobar qué nos devuelve el backend

    }



})