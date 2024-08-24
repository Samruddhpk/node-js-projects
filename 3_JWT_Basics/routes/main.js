const express = require("express")
const router = express.Router()


const { login, dashBoard } = require("../controllers/main")

const authenticationMiddleware = require("../middlewares/auth")


router.route("/dashboard").get(authenticationMiddleware, dashBoard)
router.route("/login").post(login)


module.exports = router