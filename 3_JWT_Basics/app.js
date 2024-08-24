require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()



// imports
const connectDB = require("./db/connectDB")
const errorHandler = require("./middlewares/errorHandler")
const notFound = require("./middlewares/notFound")
const mainRouter = require("./routes/main")

// middlewares
app.use(express.static("./public"))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hello")
})

app.use("/api/v1", mainRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("Connected DB")
        app.listen(port, console.log(`Server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()


