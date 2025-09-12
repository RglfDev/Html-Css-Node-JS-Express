const express = require("express")
const path = require("path")

const app = express()


app.use(express.static(path.join(__dirname, "../html")));

// Ruta para login
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/login.html"));
});

//Ruta para registrar un nuevo usuario
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/register.html"))
})

app.listen(3000)
console.log("Server on port 3000")