var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');
var download = require('download-file')

var im = require('imagemagick');

const amazonS3  = require('./amazonUpload');
console.log("amazonS3 ",amazonS3);


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
router.post('/upload', async (req, res) => {
  try {
    const allowedExt = ['.jpg','.gif', '.jpeg'];
	
    console.log("req.files ",req.files);
	
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
            im.convert([ srcCopy , '-resize', '400x300', destCopy ], async function(_err, stdout){
				
            let t =await amazonS3.uploadFile_();
            console.log("Amazon S3 url upload ",t);			
				
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
		    let srcCopy   = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + extension); 
        let destCopy  = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + "_large" + extension); 
		
        fs.mkdir( path.join(__dirname + "/../public/",  uploadFolder), { recursive: true }, (err) => { 
        
          image.mv( path.join(__dirname + "/../public/", uploadFolder, _timestamp + extension), (err) => {
            //if (err) throw err;
            if (err) {
              res.send({
                status: false,
                message: 'File is not uploaded',
              });
            }else {	 
			  
              im.convert([ srcCopy , '-resize', '400x300', destCopy ], async function(err, stdout){
                if (err) {//throw err;
                  console.log('stdout:', stdout);
                  res.send({
                    status: false,
                    message:  'Error on convert ', err
                  });
                }
                else {					  
                  let t =await amazonS3.uploadFile_();
                  console.log("Amazon S3 file upload ",t);			
                
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
          });          
        }); 
      }		
    }
  } catch (err) {
  console.log("Error ",err.message);
      res.status(500).send(err);
  }
});


router.post('/uploadmulti', async (req, res) => {
  try {
    const allowedExt = ['.jpg','.gif', '.jpeg'];
	
    console.log("req.files ",req.files);
	
    if(!req.files) {

      let image = req.body.image;
      if( image.indexOf('http:') > -1 || image.indexOf('https:') > -1 ) {

        let json = await amazonS3.imageUploadByUrl(image);
        console.log("json ",json)
        
        res.send({
          status: true,
          message: 'success',
          path: json
        });
      }	
      else 	{		
        res.send({
          status: false,
          message: "No a valid image"
        });

        
      } 	
  } else {
      let image = req.files.image;
      if(image.length > 1) {
        /*image.forEach(async (m) =>  {
          console.log("Multiple File m ",m);
          let uploadpath = await amazonS3.imageUploadByConvert(m)
          console.log("Multiple File uploadpath ",uploadpath);
          temp.push ({name : uploadpath});
        });*/

        const promises = image.map(async (m) => {  
          return await amazonS3.imageUploadByConvert(m);
        })

        /*await Promise.all(promises).then(t => {
          res.send({
            status: true,
            message: 'success',
            path: t
          });          
        });*/

        const response = await Promise.all(promises);
        console.log("Promise.all ",response)
        res.send({
          status: true,
          message: 'success',
          path: response
        });
          
      } 
      else {
        console.log("Single File");
        const uploadpath = await amazonS3.imageUploadByConvert(image);        
        console.log("Single File ",uploadpath);
        res.send({
          status: true,
          message: 'success',
          path: [{
            name: uploadpath
          }]
        });
      }
    }
  } catch (err) {
  console.log("Error ",err.message);
      res.status(500).send(err);
  }
});


module.exports = router;
