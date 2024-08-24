require("dotenv").config()
require('express-async-errors');
const express = require("express")
const app = express()
const cors = require("cors")
const rateLimiter = require("express-rate-limit")
const xssClean = require("xss-clean")
const helmet = require("helmet")


// imports
const connectDB = require("./db/connectDB")
const errorHandlerMiddleware = require("./middlewares/errorHandler")
const notFoundMiddleware = require("./middlewares/notFound")
const authRouter = require("./routes/authRouter")
const jobsRouter = require("./routes/jobsRouter")
const authenticationMiddleware = require("./middlewares/authentication")

// middlewares
app.use(express.json())
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
}))
app.use(helmet())
app.use(cors())
app.use(xssClean())

// routes
app.get("/", (req, res) => {
    res.send("Jobs API")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticationMiddleware, jobsRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

// listen

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("Connected DB")
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


start()
