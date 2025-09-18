const ui = []
document.querySelectorAll("[id]").forEach(el => (ui[el.id] = el)) //Acción para capturar todos los elementos del html por su ID de golpe



btnLogin.addEventListener("click", async () => { // Captura del evento de click del botón de login

    console.log("Boton pulsado") //Comprobación por consola de la pulsación

    const email = userInput.value //Capturamos el email del campo de texto
    const passUser = passInput.value //Capturamos la contraseña del campo de texto

    if (email === "" || passUser === "") { //Si alguno de los campos está vacío mostramos un mensaje en pantalla

        warningText.textContent = "Debes rellenar ambos campos"
        warningText.style.color = "red"

    } else { //Si todo va bien...

        console.log(email, passUser) //Comprobación de los valores capturados en los campos de texto por consola

        const userData = { //Creamos un objeto para guardar ambos datos
            password: passUser,
            email: email,
        }

        console.log(userData)

        const res = await fetch("/api/users/login", { //Hacemos un fetch de tipo POST a la dirección del servidor donde se realizarán las acciones del login 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData) //Convertimos los datos a JSON
        })



        const data = await res.json() //Capturamos el json devuelto por el servidor 

        warningText.textContent = data.message; //...y las mostramos en el texto informativo de la página...
        warningText.style.color = res.ok ? "green" : "red"; //...con su correspondiente color indicando si es éxito o fallo

        console.log("Backend: ", data.message) //Bandera para comprobar qué nos devuelve el backend
        console.log("Token:", data.token) //Impresión del token por consola
        console.log("Usuario:", data.user)

        if (res.ok) {
            localStorage.setItem("token", data.token)
            window.location.href = "/home.html"
        }

    }



})