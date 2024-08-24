// THIS FILE JUST POPULATES(SHOWS) THE READY MADE DATA - PRODUCTS.json

require("dotenv").config()

// imports 
const connectDB = require("./db/connectDb")
const Product = require("./models/Product")
const jsonProducts = require("./products.json")


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log("Success!!!")
        process.exit(0) // 0 - SUCCESS
    } catch (error) {
        console.log(error)
        process.exit(1) // 1 - ERROR
    }
}


start()


