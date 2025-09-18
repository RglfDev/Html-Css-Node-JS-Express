const jwt = require("jsonwebtoken")
const config = require("config")

const auth = (req, res, next) => {
    try {

        const token = req.header("Authorization").replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                message: "Acceso denegado. No hay Token"
            })
        }

        const decoded = jwt.verify(token, config.get("configToken.SEED"))

        req.user = decoded.data

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado"
        })
    }
}


module.exports = auth