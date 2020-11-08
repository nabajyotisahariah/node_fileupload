const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
		_id:String,
	    movie_title: String,
		img_url: String,
		release_year:Number
	}, {
	    timestamps: true
	}
);

module.exports = mongoose.model('metareel_movies', MovieSchema);
