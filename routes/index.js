var express = require('express');
var router = express.Router();

var uploadController = require('../app/controllers/upload.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', async(req, res)  => {
  let t = await amazonS3.uploadFile_1();
  console.log("t11 ",t," d ");
  
  res.send({
     status: false
   });
});


//https://static.toiimg.com/thumb/msid-77925982,width-1070,height-580,imgsize-145451,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg
// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/


/*
POST http://localhost:3000/singleupload
Form Data
    image : File
Response : 
{
    "status": true,
    "message": "success",
    "data": {
        "name": "\\images\\10\\1604055726349.jpg"
    }
}
*/
router.post('/singleupload', uploadController.singleUpload);

/*
POST http://localhost:3000/multiupload
Form Data
    image : File
    image : File
Response : 
{
    "status": true,
    "message": "success",
    "path": [
        {
            "status": true,
            "data": "\\images\\10\\1604055821897.jpg"
        },
        {
            "status": true,
            "data": "\\images\\10\\1604055821898.jpg"
        }
    ]
}
*/
router.post('/multiupload', uploadController.multiupload);

module.exports = router;
