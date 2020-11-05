const dbConfig = require('./../app/config/database.config');
var client = require('./../app/config/elastic.config');


const movies = require('./../app/models/movie.model');

/*movies.find("5f8c6492919835824fa8778a").then(res => {
    console.log("res ",res._id," = ",res._doc.movie_title," = ",res.img_url," = ",res._doc.release_year," ===",res);
    client.index({
        index: 'ngram_example',
        id: res._id,
        body: {
            "title":res._doc.movie_title,
            "language":res._doc.primary_language,
            "genre":res._doc.genre
        }
    }, function(err, resp, status) {
        console.log("index.status ",resp);
    });

})*/


//movies.find({"primary_language":"Hindi"}).skip(0).limit(1000).then(_res => {
movies.find({}).skip(0).limit(10).then(_res => {
    _res.map( res => {
        console.log("res ",res._id," = ",res._doc.movie_title," = ",res._doc," = ");
        client.index({
            index: 'ott_movies',
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
    })
})

/*let bulkArray = [];
movies.find({}).skip(100000).limit(100000).then(_res => {

    console.log("bulkArray 11 ",bulkArray)
    _res.map( res => {
        console.log("res ",res._id," = ",res._doc.movie_title," = ",res.img_url," = ");
        bulkArray.push({index: { _index: 'ott_movies', _id: res._id} }),
        bulkArray.push({
                "title":res._doc.movie_title,
                "title2":res._doc.movie_title,
                "language":res._doc.primary_language,
                "genre":res._doc.genre,
                "img_url":res._doc.img_url,
                "release_year":res._doc.release_year
        }); 
    })

    return bulkArray;
}).then( bulkArray => {
    console.log("bulkArray ",bulkArray);

    client.bulk( {
        body:bulkArray
    
    }, function (err, resp) {
        if(resp.errors) {
           console.log(JSON.stringify(resp, null, '\t'));
        }
        else {
            console.log("Resp ",resp)
        }
    });
})*/



/*
client.bulk( {
    body:[
        { index:  { _index: 'ott_movies', _id:1} },
        {
            "title":"ABC",
            "title2":"ABC",
            "language":"Hindi",
            "genre":"Action",
            "img_url":"201",
            "release_year":2010
        },
        { index:  { _index: 'ott_movies', _id:2} },
        {
            "title":"ABC22",
            "title2":"ABC22",
            "language":"Hindi",
            "genre":"Action",
            "img_url":"201",
            "release_year":2010
        }
    ]

}, function (err, resp) {
    if(resp.errors) {
       console.log(JSON.stringify(resp, null, '\t'));
    }
    else {
        console.log("Resp ",resp)
    }
});
*/