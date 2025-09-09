const template = document.querySelector(".template") // Cogemos el template
const fragment = document.createDocumentFragment() //Creamos un fragment global para cargar todos los pokemon al inicio
const container = document.querySelector(".container")
const selector = document.getElementById("typeSelector")
const searchID = document.getElementById("numSelector")
const btnFind = document.querySelector(".buttonId")


const url = "https://pokeapi.co/api/v2/pokemon/?limit=1302" //URL de la pokeAPI

pokemons = [] //Listado donde se iran guardando los objetos "pokemon" una vez se haya recopilado la info de la API

conection(url) //Se lanza la conexion a la API


async function conection(url) { //Esta función asíncrona hace un fetch a la pokeAPI, obteniendo la url de cada pokemon y guardandola en un array
    try {
        const res = await fetch(url)
        const post = await res.json()
        console.log(post)
        const pokeUrl = post.results.map((item) => item = item.url)

        extractionPost(pokeUrl) // Llamada a la función que recogera los datos de cada pokemon

    } catch (error) {
        console.log(error)
    }
}

async function extractionPost(pokeUrl) { //Esta función accede a cada URL de cada pokemon con fetch, pasandole el resultado en JSON de cada uno a la función buildPokemon

    for (item of pokeUrl) {

        try {
            const res = await fetch(item)
            const pokemonAtt = await res.json()

            buildPokemon(pokemonAtt) //Llamada a la función de creación de cada objeto POKEMON con sus atributos, a la cual se la pasa su correspondiente json del pokemon

        } catch (error) {

        }
    }
    container.appendChild(fragment)
    /*Al final de todo el proceso de carga de pokemon, de creacion de sus tarjetas y colores (al final de toda la cadena
                                      de funciones andiadas), se carga el el fragment que contiene todas las tarjetas de los pokemon para que nada mas iniciar
                                       la pagina aparezcan*/
}

function buildPokemon(pokemonAtt) { // Función que construye cada objeto pokemon con sus atributos, los guarda en la constante POKEMON y llama a la función de creación de tarjetas
    spType = translateType(pokemonAtt.types[0].type.name) //Aquí traducimos el tipo de pokemon de inglés a español con la función "translateType"

    const pokemonObj = { //Objeto pokemon con sus atributos
        id: pokemonAtt.id,
        name: pokemonAtt.forms[0].name,
        img: pokemonAtt.sprites.front_default,
        type: pokemonAtt.types[0].type.name,
        espType: spType
    }

    pokemons.push(pokemonObj) //Guardamos el pokemon en el array de objetos "pokemons"

    pokemonCard(pokemonObj) //Llamamos a la función "pokemonCard" pasandole el objeto del pokemon correspondiente
}

function pokemonCard(pokemonObj) { //Función que contruye el template con los Card de cada pokemon que le pasemos

    const clone = template.content.cloneNode(true)
    const pId = clone.querySelector(".pokemonNumber")
    const card = clone.querySelector(".containerCard")
    const pName = clone.querySelector(".pokemonName")
    const pImg = clone.querySelector(".pokemonImg")
    const pType = clone.querySelector(".pokemonType")

    pId.textContent = pokemonObj.id
    pName.textContent = pokemonObj.name
    pImg.setAttribute("src", pokemonObj.img)
    pType.textContent = pokemonObj.espType

    applyTypeColors(pokemonObj, card, pId, pName, pType); //Llamada a la función que definirá los colores de cada pokemon según su tipo

    fragment.appendChild(clone) //Agregamos en clon del template al fragment

}

selector.addEventListener("change", () => { // Función de escucha del selector para mostrar los pokemon según el tipo seleccionado

        searchID.value = ""
        /*Vaciamos el buscador para mejorar la estética
    let selectedType = selector.value //Recogemos el valor del selector
    container.innerHTML = "" //Borramos la pantalla de Cards si las hubiera
    const fragmentFilter = document.createDocumentFragment(); //Creamos un fragment propio de esta función para volver a construir el resultado

    for (item of pokemons) { // Recorremos el array de los pokemon...
        if (selectedType === "all" || item.type === selectedType) {
            /*Si el tipo seleccionad es "all" o coincide con el tipo de algún pokemon se 
                                                                               vuelve a realizar el proceso de creación por cada pokemon encontrado en el resultado*/
        const clone = template.content.cloneNode(true);

        const pId = clone.querySelector(".pokemonNumber");
        const card = clone.querySelector(".containerCard");
        const pName = clone.querySelector(".pokemonName");
        const pImg = clone.querySelector(".pokemonImg");
        const pType = clone.querySelector(".pokemonType");

        pId.textContent = item.id;
        pName.textContent = item.name;
        pImg.setAttribute("src", item.img);
        pType.textContent = item.espType;

        applyTypeColors(item, card, pId, pName, pType); // Se vuelve a llamar al metodo de coloreado
        fragmentFilter.appendChild(clone)
    }
}
container.appendChild(fragmentFilter) //Agregamos el nuevo fragment al container, haciendo que muestre las tarjetas pokemon construidas a traves del filtrado del selector
})


btnFind.addEventListener("click", () => { // Función de escucha del input numérico para filtrar por ID

    let inputID = parseInt(searchID.value) //Recogemos el input y lo pasamos a int
    container.innerHTML = "" //Borramos la pantalla de Cards si las hubiera
    const fragmentFilterId = document.createDocumentFragment() //Creamos un fragment propio de esta función para volver a construir el resultado
    let found = false //Creamos una bandera para indicar en el programa si ha habido coincidencias o no en el resultado

    for (item of pokemons) { // Recorremos el array de los pokemon...
        if (inputID === item.id) { //Si el numero de la búsqueda coincide con el de algún pokemon...
            const clone = template.content.cloneNode(true); //Volvemos a repetir el proceso de creación del fragment con el pokemon encontrado

            const pId = clone.querySelector(".pokemonNumber");
            const card = clone.querySelector(".containerCard");
            const pName = clone.querySelector(".pokemonName");
            const pImg = clone.querySelector(".pokemonImg");
            const pType = clone.querySelector(".pokemonType");

            pId.textContent = item.id;
            pName.textContent = item.name;
            pImg.setAttribute("src", item.img);
            pType.textContent = item.espType;

            applyTypeColors(item, card, pId, pName, pType); //Volvemos a llamar a la función de coloreado de las tarjetas

            fragmentFilterId.appendChild(clone); //Agregamos el template al fragment
            found = true
        }
    }
    if (!found) {
        container.innerHTML = "<h1> No existen pokemons con ese número</h1>"
    } else {
        container.appendChild(fragmentFilterId)
    }


})

function applyTypeColors(pokemonObj, card, pId, pName, pType) {
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };

    const color = typeColors[pokemonObj.type] || "#00f";

    card.style.setProperty("--type-color", color);
    card.style.backgroundColor = color + "90";

    pId.style.borderColor = color;
    pId.style.color = color;

    pName.style.borderColor = color;
    pName.style.color = color;

    pType.style.borderColor = color;
    pType.style.color = color;
}

function translateType(type) {

    const typeTranslation = {
        normal: "Normal",
        fire: "Fuego",
        water: "Agua",
        electric: "Eléctrico",
        grass: "Planta",
        ice: "Hielo",
        fighting: "Lucha",
        poison: "Veneno",
        ground: "Tierra",
        flying: "Volador",
        psychic: "Psíquico",
        bug: "Bicho",
        rock: "Roca",
        ghost: "Fantasma",
        dragon: "Dragón",
        dark: "Siniestro",
        steel: "Acero",
        fairy: "Hada"
    };

    const spType = typeTranslation[type]
    return spType
}