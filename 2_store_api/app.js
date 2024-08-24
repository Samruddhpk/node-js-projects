require("dotenv").config()
// to handle errors and get rid off asyncWrapper created in previous projects - npm package
require("express-async-errors")
const express = require("express")
const app = express()

// imports
const connectDB = require("./db/connectDb")
const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")
const productsRouter = require("./routes/products")

app.use(express.json())

app.get("/", (req, res) => {
    res.send(`<h1>Store API</h1><a href="/api/v1/products">Products Route</a>`)
})

app.use("/api/v1/products", productsRouter)

app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("Connect to DB")
        app.listen(port, console.log(`Server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()
