const express = require("express");
const morgan = require("morgan");
const app = express();
const courses = require('./web/api/courses/endpoints')
const main = require('./web/api/main')
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const cors = require("./web/middlewares/cors")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/', main)
app.use('/courses', courses)

if (app.get("env") === "development") {
    app.use(morgan("dev"));
    startupDebugger("Morgan Enabled");
}

startupDebugger("Application Name: " + config.get("name"));

app.use(cors)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to port ${port}.....`));