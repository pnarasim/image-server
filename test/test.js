const config = require("../src/config");
const sharp = require("sharp");
const { assert } = require('chai')

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

//global id to keep track of the file we uploaded and 
//to request for it bac in different formats
let fileid;

//Checking the format of the returned image
let imgBuffer, imgType;


// Tests here will do a few quick things
// - connect to our API server and upload a file
// - note the id of the uploaded file
// - retrieve that file as 4 different image formats - jpg, png, tiff, webp
// - check the data returned is of that format : extract metadata from sharp and compare format values

// TBD TBD TBD
// Before we begin, empty out the Collection
// Connect to the mongodb DB with the credentials in ../config.js
// empty the collection images


describe('Images : APIs to upload, and download converted versions',  () => {
  
  describe('POST : upload an image to /upload',  () => {
    it('upload an image', (done) => {
      chai.request(server)
        .post('/upload')
        .attach('file', './test/pic1.jpeg')
        .end((err,res) => {
          res.should.have.status(200);
          //res.body.should.have.property('filename');
          //res.body.errors.should.have.property('success');
          fileid = res.body.filename;
          console.log(" Filename = ", fileid);
        done();
      });
    });
  });

  describe('GET the uploaded image in different formats', () => {
    it('gets jpg', (done) => {
      let ext = "jpg";
      let url_file = '/files/' + fileid + "." + ext;
      //console.log("Getting file : ", url_file);
      chai.request(server)
        .get(url_file)
        .end((err, res) => {
          res.should.have.status(200);
          //res.body.should.be.a('array');
          imgBuffer = res.body;
          getImageType(imgBuffer)
          .then((data) => { 
            
          });
        done();
      });
    });

    it('gets png', (done) => {
      let ext = "png";
      let url_file = '/files/' + fileid + "." + ext;
      chai.request(server)
        .get(url_file)
        .end((err, res) => {
              res.should.have.status(200);
              //res.body.should.be.a('array');
              imgBuffer = res.body;
              getImageType(imgBuffer)
              .then((data) => { 
                
              });
        done();
      });
    });

    it('gets tiff', (done) => {
      let ext = 'tiff';
      let url_file = '/files/' + fileid + '.' + ext;
      chai.request(server)
        .get(url_file)
        .end((err, res) => {
              res.should.have.status(200);
              //res.body.should.be.a('array');
              imgBuffer = res.body;
              getImageType(imgBuffer)
              .then((data) => { 
                
              });
        done();
      });
    });

    it('gets webp', (done) => {
          let ext = 'webp';
          let url_file = '/files/' + fileid + "." + ext;
          chai.request(server)
            .get(url_file)
            .end((err, res) => {
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  imgBuffer = res.body;
                  getImageType(imgBuffer)
                  .then((data) => { 
                    
                });
            done();
          });
        });
  });

  // Get the entire list from the DB : only to look for something.
  // describe('/GET all the images', () => {
  //   it('it should GET all the images', (done) => {
  //     chai.request(server)
  //       .get('/files')
  //       .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a('array');
  //           console.log(res.body);
  //       done();
  //     });
  //   });
  // });

});

const getImageType = async(buf) =>  {
  try {
    const data = await sharp(buf).metadata();
    let type = data.format;
    const jpgs = ['jpeg', 'jpg'];
    if (jpgs.indexOf(type) > -1 ) {
      type = 'jpg';
    }
    console.log(" File Metadata says format is ", type); 
    return(type);
  } catch (err) {
    console.log(err);
  }

}