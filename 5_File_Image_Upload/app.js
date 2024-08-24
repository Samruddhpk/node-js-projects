require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const cors = require("cors")

const fileUpload = require('express-fileupload');
// USE V2
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// database
const connectDB = require('./db/connectDB');

// product router
const productRouter = require('./routes/productsRoutes');

// error handler
const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');

app.use(express.static('./public'));

app.use(express.json());
app.use(cors())
app.use(fileUpload({ useTempFiles: true }));

app.get('/', (req, res) => {
    res.send('<h1>File Upload Starter</h1>');
});

app.use('/api/v1/products', productRouter);
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
