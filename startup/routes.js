const express = require("express");
const courses = require("../web/api/courses/endpoints");
const users = require("../web/api/users/endpoints");
const error = require("../web/middlewares/error");
const cors = require("../web/middlewares/cors");
const main = require("../web/api/main");

module.exports = function (app) {
    app.use(express.json());
    app.use("/", main);
    app.use("/courses", courses);
    app.use("/users", users);
    app.use(cors);
    app.use(error);
}
