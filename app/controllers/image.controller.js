const dbConfig = require('./../config/database.config');
const Image = require('../models/image.model');

/*
POST http://localhost:3000/users/notes
Data
    title:ABC
    content:ABC
*/
// Create and Save a new Note
exports.create = (req, res) => {
	console.log("create ",req.body);
	// Validate request
    if(!req.body.title || !req.body.content) {
        return res.send({
			status:false,
            data: "Wrong input"
        });
    }

    // Create a Image
    const note = new Image({
        title: req.body.title || "Untitled title", 
        content: req.body.content || "Untitled content", 
    });

    // Save Image in the database
    note.save()
    .then(data => {
		//res.send(data);
		res.send({status:true,
				data: "success"
				})
    }).catch(err => {
        res.send({
			status:false,
            data: "Tecnical issue."
        });
    });
};

// // Retrieve and return all notes from the database.
/*
GET http://localhost:3000/users/notes

{
    "status": true,
    "data": [
        {
            "_id": "5f9be0c80ae83a4c3052b519",
            "title": "ABC",
            "content": "ABC",
            "createdAt": "2020-10-30T09:45:44.584Z",
            "updatedAt": "2020-10-30T09:45:44.584Z",
            "__v": 0
        }
    ]
}
*/
exports.findAll = (req, res) => {

	console.log("findAll");
	Image.find()
    .then(notes => {
        res.send({status:true, data: notes});
    }).catch(err => {
        res.send({
			status:false,
            data: "Tecnical issue."
        });
    });
};

// Find a single note with a noteId
/*
GET http://localhost:3000/users/notes/5f9be0c80ae83a4c3052b519
*/
exports.findOne = (req, res) => {
    Image.findById(req.params.noteId)
    .then(note => {
        if(!note) {
			return res.send({
				status:false,
				data: "Wrong input"
			});           
        }
        res.send({status:true, data: note});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
			return res.send({
				status:false,
				data: "Wrong input"
			});              
        }
        return res.send({
			status:false,
            data: "Wrong input"
        });
    });
};

// Update a note identified by the noteId in the request
/*
PUT    : http://localhost:3000/users/notes/5f9be0c80ae83a4c3052b519
title   : ABC111
content : ABC22
*/
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content || !req.body.content) {
        return res.send({
			status:false,
            data: "Wrong input"
        });
    }

    // Find note and update it with the request body
    Image.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.send({
				status:false,
				data: "Wrong input"
			});
        }
        res.send({status:true, data: note});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.send({
				status:false,
				data: "Wrong input"
			});            
        }
        return res.send({
			status:false,
            data: "Wrong input"
        });
    });
};

// Delete a note with the specified noteId in the request
/*
DELETE - http://localhost:3000/users/notes/5f9be0c80ae83a4c3052b519
*/
exports.delete = (req, res) => {
    Image.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.send({
				status:false,
				data: "Wrong input"
			});
        }
        res.send({status:true, data: "success"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.send({
				status:false,
				data: "Wrong input"
			});            
        }
        return res.send({
			status:false,
            data: "Wrong input"
        });
    });
};