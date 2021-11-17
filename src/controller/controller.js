const upload = require("../middleware/upload");
const config = require("../config");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const sharp = require("sharp");

// Description:
// 3 main functions here
// uploadFiles() : calls the middleware to set up the gridfsstorage+multer connection to mongodb to upload the file
// getListFiles() : connects to the mongodb and gets a list of all the records in the collection
// download() : Determines the format of the image the user expects from the file extension
//              Connects to mongodb via the GridFSBucket connecttion and concats the chunks from downloadstream
//              Passes the concatenated buffer to sharp to convert to the required format
//              This is sent back to the client with the appropriate content-type header

const url = config.db.connectionString;

const baseUrl = config.web.baseUrl;

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    
    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }
    //console.log(" Uploadef file. ID = ", req.file.filename);
    return res.json({
      success:true,
      filename: req.file.filename,
      message: "File has been uploaded."
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(config.db.database);
    const images = database.collection(config.db.imgBucket + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(config.db.database);
    const bucket = new GridFSBucket(database, {
      bucketName: config.db.imgBucket,
    });
    let userFilename = req.params.name;
    var  filename_split =  userFilename.split('.');
    var ext = filename_split[1];
    var filename = filename_split[0];
    //console.log("User has requested file = ", userFilename);
    //console.log("Looking in our DB for filename= ", filename); 
    
    bucket.find({filename: filename})
    .toArray(function(err, docs) {
      if (err) {
        return res.status(300).send({message: `Error retrieving file ${filename}.${ext}`});
      }
      if (!docs || docs.length === 0) {
        return res.status(404).send({message: `Cannot download the file ${filename}.${ext}`});
      } else {

        var savedType = JSON.parse(JSON.stringify(docs[0])).contentType;
        
        //console.log(" Image saved as ", savedType, " requested as ", ext);

        let downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.read();
        return new Promise((resolve, reject) => {
          const chunks = [];
          downloadStream.on('data', data => {
            chunks.push(data);
          });
          downloadStream.on('end', () => {
            let contenttype = 'image/' + ext;

            const data = Buffer.concat(chunks);
            sharp(data)
            .toFormat(ext)
            .toBuffer()
            .then( data => { 
                    res.setHeader('content-type', contenttype);
                    res.status(200).send(data)
                  })
            .catch( err => { console.log("Ooops: ", err); })
            resolve(res.status(200));
          });

          downloadStream.on("error", function (err) {
            return res.status(404).send({ message: `Cannot download the Image! : ${err} ` });
          });         
        });
      }
    }); 
  } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
  }
}

module.exports = {
  uploadFiles,
  getListFiles,
  download,
};
