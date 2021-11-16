var config = {};

config.web = {};
config.db = {};


config.web.port = process.env.WEB_PORT || 8080;

config.web.baseUrl = `http://localhost:${config.web.port}/files/`;

config.db.user = `demo`;
config.db.password = `demo`; // set up calls to encrypt this with some library and access with decrypts etc
config.db.connectionString = `mongodb+srv://${config.db.user}:${config.db.password}@cluster0.ghbeq.mongodb.net/test?retryWrites=true&w=majority`;
config.db.database = "test";
config.db.imgBucket = "images";

module.exports = config;