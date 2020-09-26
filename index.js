const portConnection = require("debug")("app:port");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/logging")();
require("./startup/config")();

const port = process.env.PORT || 3000;

app.listen(port, () => portConnection(`Listening to port ${port}.....`));