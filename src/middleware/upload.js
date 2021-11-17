const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const config = require("../config");
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

// Description:
// This module sets up the GridFsStorage connection via multer to upload the file chunks to mongodb

const mongoURI = config.db.connectionString;

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
        //console.log("ID returned to user is ", buf.toString('hex'));
        const filename = buf.toString('hex');
        //const filename = buf.toString('hex') + path.extname(file.originalname);
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
