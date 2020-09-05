var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');
var download = require('download-file')

var im = require('imagemagick');
console.log("im ",im)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//https://static.toiimg.com/thumb/msid-77925982,width-1070,height-580,imgsize-145451,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg
router.post('/upload', async (req, res) => {
  try {
    const allowedExt = ['.jpg','.gif', '.jpeg'];
    
    if(!req.files) {

      let image = req.body.image;
      if( image.indexOf('http:') > -1 || image.indexOf('https:') > -1 ) {
        
        const url = image;
        const extension = path.extname(image);	
        let _timestamp = Date.now();
        let _date = new Date(_timestamp);
        
        let uploadFolder = `/images/${_date.getMonth() + 1}`;
        let srcFolder  = path.join(__dirname + "/../public/" , uploadFolder); 

        let srcCopy   = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + extension); 
        let destCopy  = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + "_large" + extension); 
        
        var options = {
          directory: srcFolder,
          filename: _timestamp + extension
        }
       
        download(url, options, function(err){					
        
          if(err || allowedExt.indexOf(extension) == -1) {						
            res.send({
              status: false,
              message: err ? 'image not found' : 'Only images with this extension are supported .jpg|.gif|.jpeg',
            });
          } else {


            im.convert([ srcCopy , '-resize', '400x300', destCopy ],  function(_err, stdout){
              if (_err) {//throw err;
                console.log('stdout:', stdout);
                res.send({
                  status: false,
                  message:  'Error on convert ', _err
                });
              }
              else {
                res.send({
                  status: true,
                  message: 'success',
                  data: {
                    name: path.join(uploadFolder,  _timestamp + extension)
                  }
                });
              }
            });
            
          }
        }) 
    }	
    else 	{		
      res.send({
        status: false,
        message: "No a valid image"
      });
    } 	
  } else {

      //Use the name of the input field (i.e. "image") to retrieve the uploaded file
      let image = req.files.image;
      
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      //image.mv(image.tempFilePath, './uploads/' + image.name );

      const extension = path.extname(image.name);
      if(allowedExt.indexOf(extension) == -1) {
        
        res.send({
          status: false,
          message: 'Only images with this extension are supported .jpg|.gif|.jpeg',
        });
      } else {	
            
        let _timestamp = Date.now();
        let _date = new Date(_timestamp);
        
        let uploadFolder = `/images/${_date.getMonth() + 1}`;

        fs.mkdir( path.join(__dirname + "/../public/",  uploadFolder), { recursive: true }, (err) => { 
        
          image.mv( path.join(__dirname + "/../public/", uploadFolder, _timestamp + extension), (err) => {
            //if (err) throw err;
            if (err) {
              res.send({
                status: false,
                message: 'File is not uploaded',
              });
            }else {	
              //send response
              res.send({
                status: true,
                message: 'success',
                data: {
                  name: path.join(uploadFolder, _timestamp + extension)
                }
              });
            }
          });
          
        }); 
        
        
      }		
    }
  } catch (err) {
  console.log("Error ",err.message);
      res.status(500).send(err);
  }
});



module.exports = router;
