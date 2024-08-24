require("dotenv").config();
require("express-async-errors");


const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require("morgan");

// Imports
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

// routes imports
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productsRouter = require('./routes/productsRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const ordersRouter = require("./routes/ordersRoutes");

// Middleware
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));   // parse cookie from user/browser/client & signed with jwt secret
app.use(express.static('../final-front-end/front-end'));
app.use(fileUpload());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// see token in every request sending present in cookies
app.get("/api/v1", (req, res) => {
    // console.log(req.cookies); // normal cookies
    console.log(req.signedCookies); // normal cookies
    res.send("Ecommerce api");
});


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use("/api/v1/orders", ordersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// Listen
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('connected DB connection');
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


start();

