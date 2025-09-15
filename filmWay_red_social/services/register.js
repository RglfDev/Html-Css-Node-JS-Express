const ui = []


document.querySelectorAll(["id"]).forEach(el => (ui[el.id] = el))



btnRegister.addEventListener("click", () => {

    const name = userName.value
    const surname = userSurname.value
    const nick = userNick.value
    const email = userEmail.value
    const pass = userPass.value
    const rPass = userRepeatPass.value

    if (name === "" || surname === "" || nick === "" || email === "" || pass === "" || rPass === "") {

        failureText.textContent = "Debes rellenar todos los campos"

    } else if (!checkbox.checked) {

        failureText.textContent = "Debes aceptar los términos y condiciones"

    } else if (pass.length < 8) {

        failureText.textContent = "Las contraseña debe tener al menos 8 caracteres"

    } else if (pass !== rPass) {

        failureText.textContent = "Las contraseñas no coinciden"

    } else {

        failureText.textContent = ""
        console.log(name, surname, nick, email, pass)
    }
})