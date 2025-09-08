const element = document.querySelector(".element")
const fragment = document.createDocumentFragment()
const templateCard = document.querySelector(".templateCard").content

const templateCardList = document.querySelector("#templateCardList").content
const listContainer = document.querySelector(".list")

let total = 0

renderTotal()

const coffeeCollection = [{
        name: "Espresso",
        description: "Un café intenso y concentrado, servido en una pequeña taza.",
        price: 1.50,
        image: "./img/espresso.png"
    },
    {
        name: "Cappuccino",
        description: "Café espresso con leche espumada y un toque de cacao por encima.",
        price: 2.20,
        image: "./img/capuccino.png"
    },
    {
        name: "Latte",
        description: "Espresso con abundante leche vaporizada, suave y cremoso.",
        price: 2.50,
        image: "./img/Latte.jpg"
    },
    {
        name: "Americano",
        description: "Espresso rebajado con agua caliente, más suave que el espresso clásico.",
        price: 1.80,
        image: "./img/americano.webp"
    },
    {
        name: "Mocha",
        description: "Combinación de café espresso, chocolate caliente y leche espumada.",
        price: 2.80,
        image: "./img/mocha.jpg"
    },
    {
        name: "Macchiato",
        description: "Espresso coronado con una pequeña cantidad de espuma de leche.",
        price: 2.00,
        image: "./img/latte-macchiato1.jpg"
    }
];

pritnCard()

function pritnCard() {

    coffeeCollection.forEach((item) => {
        const clone = templateCard.cloneNode(true)
        clone.querySelector(".coffeeHeader").textContent = item.name
        clone.querySelector(".coffeeImg").src = item.image
        clone.querySelector(".price").textContent = item.price
        const btnAdd = clone.querySelector(".btn.add")
        btnAdd.dataset.name = item.name
        btnAdd.dataset.price = item.price

        fragment.appendChild(clone)
    })

    element.appendChild(fragment)

}


document.addEventListener("click", e => {
    if (e.target.matches(".btn.add") && e.target.closest(".coffees")) {
        addToChart(e)
    }

    if (e.target.matches(".product .btn.add")) {
        changeUnits(e)
    }

    if (e.target.matches(".product .btn.remove")) {
        changeUnits(e)
    }

    if (e.target.matches("#btnCesta")) {
        showList()
    }
})



const addToChart = (e) => {
    const name = e.target.dataset.name
    const price = parseFloat(e.target.dataset.price)

    const existProduct = Array.from(listContainer.querySelectorAll(".product"))
        .find(prod => prod.querySelector(".nameList").textContent === name)

    if (existProduct) {
        let unitsElem = existProduct.querySelector(".units")
        unitsElem.textContent = parseInt(unitsElem.textContent) + 1

        const totalPriceElement = existProduct.querySelector(".totalPriceUnit")
        const units = parseInt(existProduct.querySelector(".units").textContent)

        if (!totalPriceElement.dataset.price) {
            totalPriceElement.dataset.price = price
        }

        totalPriceElement.textContent = (price * units).toFixed(2)
    } else {

        const clone = templateCardList.cloneNode(true)
        clone.querySelector(".nameList").textContent = name
        clone.querySelector(".units").textContent = 1
        const totalPriceElem = clone.querySelector(".totalPriceUnit")
        totalPriceElem.textContent = price.toFixed(2)
        totalPriceElem.dataset.price = price
        listContainer.appendChild(clone)
    }

    renderTotal()
}


function changeUnits(e) {
    const product = e.target.closest(".product")
    const unitsElem = product.querySelector(".units")
    let units = parseInt(unitsElem.textContent)

    if (e.target.matches(".btn.add")) {
        units += 1
    } else if (e.target.matches(".btn.remove")) {
        units -= 1
    }

    if (units < 1) {
        product.remove()
    } else {
        unitsElem.textContent = units
        const totalPriceElem = product.querySelector(".totalPriceUnit")
        const unitPrice = parseFloat(totalPriceElem.dataset.price) || 0
        totalPriceElem.textContent = (units * unitPrice).toFixed(2)
    }

    renderTotal()
}

function renderTotal() {
    const products = Array.from(listContainer.querySelectorAll(".product"));
    let newTotal = 0;

    // Calculamos el total
    products.forEach(prod => {
        const unitsElem = prod.querySelector(".units");
        const units = parseInt(unitsElem.textContent);
        const totalPriceElem = prod.querySelector(".totalPriceUnit");
        const unitPrice = parseFloat(totalPriceElem.dataset.price) || 0;

        totalPriceElem.textContent = (units * unitPrice).toFixed(2);
        newTotal += units * unitPrice;
    });

    // Eliminamos mensaje vacío anterior
    const oldEmptyMsg = document.querySelector(".emptyListMsg");
    if (oldEmptyMsg) oldEmptyMsg.remove();

    // Si no hay productos, mostramos mensaje y ocultamos TOTAL
    if (products.length === 0) {
        const totalElem = document.querySelector(".total");
        if (totalElem) totalElem.style.display = "none";

        const emptyMsg = document.createElement("p");
        emptyMsg.className = "emptyListMsg";
        emptyMsg.textContent = "Aún no tienes cafés en tu lista de compra";
        listContainer.appendChild(emptyMsg);
        return;
    }

    // Mostramos TOTAL al final
    let totalElem = document.querySelector(".total");
    if (!totalElem) {
        totalElem = document.createElement("div");
        totalElem.className = "nameTotal total";
        listContainer.appendChild(totalElem); // lo ponemos al final una vez
    }
    totalElem.style.display = "block";
    totalElem.textContent = `TOTAL $${newTotal.toFixed(2)}`;
}

function showList(e) {
    const myList = document.querySelector(".myList");
    if (myList.style.display === "block") {
        myList.style.display = "none";
    } else {
        myList.style.display = "block";
    }
}