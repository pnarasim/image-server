const express = require("express");
const config = require("./src/config");

const app = express();

global.__basedir = __dirname;

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.listen(config.web.port, () => {
  console.log(`Running at localhost:${config.web.port}`);
});





module.exports = app; //for testing