const express = require("express");
const app = express();
require("dotenv").config();

// imports
const connectDB = require("./db/connect");
const tasksRouter = require("./routes/tasks");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

// middlewares
app.use(express.static("./public"));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.use("/api/v1/tasks", tasksRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// listen
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
