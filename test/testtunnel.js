
const dbConfig = require('./../app/config/database.config');
var client = require('./../app/config/elastic.config');


/*const movies = require('./../app/models/movie.model');

movies.find({}).skip(0).limit(10).then(_res => {    
    _res.map( res => {
        if(res._doc.release_year <= 2020 ) {
            console.log("res ",res._id," = ",res._doc.movie_title," = ",res._doc," = ");
            client.index({
                index: 'metareel_movies',
                id: res._id,
                body: {
                    "title":res._doc.movie_title,
                    "title2":res._doc.movie_title,
                    "language":res._doc.primary_language,
                    "genre":res._doc.genre,
                    "img_url":res._doc.img_url,
                    "release_year":res._doc.release_year
                }
            }, function(err, resp, status) {
                console.log("index.status ",resp);
            });  
            //sleep(1000);
        } 
    })

})
*/


