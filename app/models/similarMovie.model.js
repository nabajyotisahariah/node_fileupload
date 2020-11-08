const mongoose = require('mongoose');

const SimilarMovieSchema = mongoose.Schema({
        _id:String,
        movie_id:String,
	    movie_title: String,
        primary_language: String,
        genre: String,
        release_year:Number,
        similar_movies:[]
	}, {
	    timestamps: true
	}
);

module.exports = mongoose.model('sample_movies', SimilarMovieSchema);
