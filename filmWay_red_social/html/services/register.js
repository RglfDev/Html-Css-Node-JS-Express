/** 
 *Fichero que contiene la lógica de captura de información en el registro de usuarios
 */

const ui = []
document.querySelectorAll(["id"]).forEach(el => (ui[el.id] = el)) //Acción para capturar todos los elementos del html por su ID de golpe

btnRegister.addEventListener("click", async () => { //Evento de click del botón

    //Capturamos todos los campos
    const name = userName.value
    const surname = userSurname.value
    const nick = userNick.value
    const email = userEmail.value
    const pass = userPass.value
    const rPass = userRepeatPass.value

    if (name === "" || surname === "" || nick === "" || email === "" || pass === "" || rPass === "") { //Comprobación para ver que todos lso campos han sido rellenados

        failureText.textContent = "Debes rellenar todos los campos"
        failureText.style.color = "red"

    } else if (!checkbox.checked) { //Los terminos tienen que ser aceptados

        failureText.textContent = "Debes aceptar los términos y condiciones"
        failureText.style.color = "red"

    } else if (pass.length < 8) { //La contraseña tiene que tener al menos 8 caracteres

        failureText.textContent = "Las contraseña debe tener al menos 8 caracteres"
        failureText.style.color = "red"

    } else if (pass !== rPass) { //Ci la contraseña repetida no es igual que la introducida de primeras mandamos error

        failureText.textContent = "Las contraseñas no coinciden"
        failureText.style.color = "red"

    } else {

        try { //Construimos un objeto con la información capturada

            const userData = {
                userName: name,
                userSurname: surname,
                nickName: nick,
                password: pass,
            }


            //Hacemos un fetch a la ruta de guardado de usuarios y le pasamos en JSON el objeto userData para que pueda ser tratado
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(userData)
            })


            const data = await res.json() //Recuperamos la información de las acciones del Backend...

            failureText.textContent = data.message; //...y las mostramos en el texto informativo de la página...
            failureText.style.color = res.ok ? "green" : "red"; //...con su correspondiente color indicando si es éxito o fallo

            console.log("Backend: ", data.message) //Bandera para comprobar qué nos devuelve el backend

        } catch (err) { //Si hay un error lo lanzamos y lo capturamos
            failureText.textContent = "Error de conexión con el servidor";
            failureText.style.color = "red";
        }

        console.log(name, surname, nick, email, pass) //Simple impresión de los datos recogidos en los campso de texto
    }
})