# image-server
nodejs + express + mongodb example for creating an image upload+format conversion api server


## Setup
- git clone https://github.com/pnarasim/image-server.git 
- npm install
- npm run dev


This starts up the server at port 8080

You can modify the configs (which port to use and which mongodb URI to connect to in the file src/config.js)

I have put up a test mongodb cluster wth credentials of demo/demo just to enable testing of this API

Eventually I will remove the cluster, hence there should be no real security risk of exposing thie username/passwd/cluster here for this demo


## Design
### HTTP POST requests to "http://localhost:8008/upload"
- provide the file to be uploaded in the body with a key of "field" and the value is the file to upload
- if the server accepts your request, it will return a HTTP 200 response, with the following JSON text
```
	{
    "success": true,
    "filename": "4aa3b7dd808795eb024ad89afb255525",
    "message": "File has been uploaded."
	}
 
```

- the filename refers to the ID with which you can access this file again in the future from this server

### HTTP GET requests to "http://localhost:8080/files/:name"
-  name refers to a filename of the form {name.ext}, where, the id you were returned during a previous POST is the name and the ext is the format on which you wish receive your image
- the nodejs sharp library will retrieve the original file from mongodb and convert it (if possible) to the extension format you requested
- any errors in the process will be reflected back to you
- if successful, you will receive the image back in the converted form.

### HTTP GET requests to "http://localhost:8080/files"
- will list all the files in our DB with their IDs 