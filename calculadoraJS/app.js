const ui = {}

document.querySelectorAll("[id]").forEach(el => (ui[el.id] = el)) //Código para obtener todos los id del html y guardarlos en una coleccion

const botones = document.querySelectorAll(".btn")


botones.forEach((e) => { //Con un delegador de eventos, si los botones no son = o C, asignamos su valor al de su tecla y lo plasmamos en la pantalla de la calc
    if (e.id !== "igual" && e.id !== "borrar") {
        e.addEventListener("click", () => {
            if (ui.resultado.textContent === "ERROR" || ui.resultado.textContent === "0") { //Si en la pantalla esta escrito ERROR o 0, lo sobreescribimos con la tecla pulsada
                ui.resultado.textContent = e.textContent
            } else {
                ui.resultado.textContent += e.textContent //Si no hay errores ni vacíos, vamos escribiendo en la pantalla el valor de la letra
            }
        })

    }
})


ui.borrar.addEventListener("click", () => { // Llamada a la función borrar cuando se pulsa su botón
    borrar()
})


ui.igual.addEventListener("click", () => { //Llamada a la función que calcula la operación
    resultado()
})

function borrar() { // Función de borrado la cual pone la pantalla a 0          
    ui.resultado.textContent = "0"
}


function resultado() { //Función de resultado que se activa cuando se pulsa el botón de =

    let operacion = ui.resultado.textContent //Recogemos la operación en una variable
    console.log(operacion)

    let contador = 0 //Utilizamos un contador para llevar la cuenta de cuantos signos de operación se escriben en la cuenta
    for (let i = 0; i < operacion.length; i++) { //Bucle que desglosa y recorre cada caracter de la operación

        if (operacion[i] === "+" || operacion[i] === "-" || operacion[i] === "*" || operacion[i] === "/") { //Si la operación contiene uno de estos símbolos, se suma 1 al contador
            contador++
        }
    }

    if (contador > 1) { //Si el contador ha contado mas de un símbolo de operación, imprimiremos por pantalla ERROR para evitar futuros fallos
        ui.resultado.textContent = "ERROR"
        return
    }
    try { // Una vez revisada la operación y que todo está correcto, pasamos a resolver la operación
        let res = ui.resultado.textContent = eval(operacion) //La función "eval" lee una operación en formato String y la resuelve automáticamente
        ui.resultado.textContent = Number(res) //Pasamos el resultado a la pantalla
        console.log(res)
    } catch {
        ui.resultado.textContent = "Error" //Si hay algún tipo de error, lo contenemos con Catch
    }
}