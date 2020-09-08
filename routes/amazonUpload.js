const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
var im = require('imagemagick');
var download = require('download-file')

const amazonS3 = {
	
	createBucket : function()  {
		const ID = '';
		const SECRET = '';

		// The name of the bucket that you have created
		const BUCKET_NAME = 'test-bucket'; 

		const s3 = new AWS.S3({
			accessKeyId: ID,
			secretAccessKey: SECRET
		});
		
		const params = {
			Bucket: BUCKET_NAME,
			CreateBucketConfiguration: {
				// Set your region here
				LocationConstraint: "eu-west-1"
			}
		};

		s3.createBucket(params, function(err, data) {
			if (err) console.log(err, err.stack);
			else console.log('Bucket Created Successfully', data.Location);
		});
		
	},

	uploadFile : function()  {
		// Read content from the file
		const fileContent = fs.readFileSync(fileName);

		// Setting up S3 upload parameters
		const params = {
			Bucket: BUCKET_NAME,
			Key: 'cat.jpg', // File name you want to save as in S3
			Body: fileContent
		};

		// Uploading files to the bucket
		s3.upload(params, function(err, data) {
			if (err) {
				throw err;
			}
			console.log(`File uploaded successfully. ${data.Location}`);
		});
	},	

	imageUploadByUrl :  function (image) {

		console.log("imageUploadByUrl ",image)
		return new Promise((resolve, reject) => {

			const allowedExt = ['.jpg','.gif', '.jpeg'];
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
		
			download(image, options, function(err){					
			
				if(err || allowedExt.indexOf(extension) == -1) {						
					resolve ({
						status: false,
						data: err ? 'image not found' : 'Only images with this extension are supported .jpg|.gif|.jpeg',
					});
				} else {
					im.convert([ srcCopy , '-resize', '400x300', destCopy ], async function(_err, stdout){
						
						let t =await amazonS3.uploadS3();
						console.log("Amazon S3 url upload ",t);			
							
						if (_err) {//throw err;
							console.log('stdout:', stdout);
							resolve ({
								status: false,
								data:  'Error on convert ', _err
							});
						}
						else {
							resolve ({
								status: true,
								data: path.join(uploadFolder,  _timestamp + extension)                  
							});
						}
					});            
				}
			}) 
		})	
	},
	
	imageUploadByConvert : function (image) {

		return new Promise((resolve, reject) => {

			const allowedExt = ['.jpg','.gif', '.jpeg'];
			const extension = path.extname(image.name);
			let _timestamp = Date.now();
			let _date = new Date(_timestamp);
			
			if(allowedExt.indexOf(extension) == -1) {
				return resolve ({
					status: false,
					data:  'Only images with this extension are supported .jpg|.gif|.jpeg',
				});
			}
			
			let uploadFolder = `/images/${_date.getMonth() + 1}`;
			let uploadFolderPath   = path.join(__dirname + "/../public/" , uploadFolder);
			let srcCopy   = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + extension); 
			let destCopy  = path.join(__dirname + "/../public/" , uploadFolder, _timestamp + "_large" + extension); 	

			if (!fs.existsSync(uploadFolderPath)) fs.mkdirSync(uploadFolderPath,'0777', true);

			image.mv( path.join(uploadFolderPath, _timestamp + extension), (err) => {
				//if (err) throw err;
				if (err) {
					 resolve ({
						status: false,
						data: err ? 'image not found' : 'Only images with this extension are supported .jpg|.gif|.jpeg',
					});
				}else {	 
				
					im.convert([ srcCopy , '-resize', '400x300', destCopy ], async function(err, stdout){
					//im.convert([ srcCopy , '-resize', '400x300', destCopy ], function(err, stdout){
						if (err) {
							 resolve ({
								status: false,
								data: err ? 'image not found' : 'Only images with this extension are supported .jpg|.gif|.jpeg',
							});
						}
						else {					  
							let t =await amazonS3.uploadS3();
							console.log("uploadFile_ trigger. t ",t)
							 resolve ({
								status: true,
								data: path.join(uploadFolder,  _timestamp + extension)
							});
						}
					})
				}	
			})	
		})	
		//return await promise; 
	},
	
	uploadFile_1 :  function()  {
		console.log("Calling uploadFile_");

		let promise = new Promise((resolve, reject) => {
				console.log("Calling uploadFile_ 11");
			setTimeout(() => resolve("done!"), 1000)
		});
		return promise;
	},	
	
	uploadS3 : async function()  {
		let promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve("Amazon S3 upload!"), 1000)
		});
		return await promise; 
	}

	/*
	 const promise1 = Promise.resolve(3);
        const promise2 = 42;
        const promise3 = new Promise((resolve, reject) => {
          setTimeout(resolve, 100, 'foo');
        });

        Promise.all([promise1, promise2, promise3]).then((values) => {
          console.log(values);
		});
	*/	
};

module.exports = amazonS3;