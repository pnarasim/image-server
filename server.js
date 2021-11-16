const cors = require("cors");
const express = require("express");
const config = require("./src/config");

const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};
const initRoutes = require("./src/routes");

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.listen(config.web.port, () => {
  console.log(`Running at localhost:${config.web.port}`);
});





