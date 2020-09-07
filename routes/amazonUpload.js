const fs = require('fs');
const AWS = require('aws-sdk');

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
	
	
	
	uploadFile_1 :  function()  {
		console.log("Calling uploadFile_");

		let promise = new Promise((resolve, reject) => {
				console.log("Calling uploadFile_ 11");
			setTimeout(() => resolve("done!"), 1000)
		});
		return promise;
	},	
	
	uploadFile_ : async function()  {
		console.log("Calling uploadFile_");

		let promise = new Promise((resolve, reject) => {
				console.log("Calling uploadFile_ 11");
			setTimeout(() => resolve("done!"), 1000)
		});
		return await promise; 
	}
};

module.exports = amazonS3;