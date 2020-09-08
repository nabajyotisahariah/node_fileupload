const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
	    title: String,
	    content: String
	}, {
	    timestamps: true
	}
);

module.exports = mongoose.model('images', ImageSchema);
