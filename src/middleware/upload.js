const util = require("util");
const multer = require("multer");
const { GridFsStorage, Grid } = require("multer-gridfs-storage");
const config = require("../config");
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

//const maxSize = 2 * 1024 * 1024;

const mongoURI = `mongodb+srv://demo:demo@cluster0.ghbeq.mongodb.net/test?retryWrites=true&w=majority`;

const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });

var storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        console.log("ID returned to user is ", buf.toString('hex'));
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: config.db.imgBucket
        };
        resolve(fileInfo);
      });
    });
  }
});

let uploadFile = multer({
  storage: storage
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
