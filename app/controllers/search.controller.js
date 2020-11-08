
var client = require('./../config/elastic.config');
const SimailarMovies = require('../models/similarMovie.model');


exports.getSearch = async (req, res) => {

    console.log("exports.getSearch ",req.params.key)

    /*const result = await client.search({
        index: 'ott_movies',
        body: {
          query: {
            match: { title: req.params.key }
          }
        }
      })*/
      
      //https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
      try {
        const result = await client.search({
          index: 'ott_movies',
          body: {
            query: {
              multi_match: {
                "query": req.params.key,
                 "fields": ["title", "title2^2", "language^3", "genre^2"]
              }
            }
          }
        })
        console.log("result ",result);
        var temp = [];
        result.hits.hits.forEach( (res) => {
          temp.push(res._source);
          //temp['_score'] = res._score;
          //temp['_id'] = res._id;
          //console.log("temp ",temp)
        })
        return res.send({
        status:true,
              data: temp
          });
  
      }catch(e) {
        console.log("Errr ",e.message)
        return res.send({
          status:false,
                data: []
        });
  
      }
      
};

exports.getForyou = async (req, res) => {
  try {
    console.log("exports.getForyou ",req.query.language)
    let _json = {};
    if(req.query.language && req.query.genre) {
      _json = [{ "match": { "language": req.query.language  ? req.query.language  : '' }},
              { "match": { "genre":  req.query.genre  ? req.query.genre  : '' }}]

    }
    else if(req.query.language) {
      _json = [{ "match": { "language": req.query.language  ? req.query.language  : '' }}]
    }
    const result = await client.search({
      index: 'ott_movies',
      body: {      
          "query": {
            "bool": {            
                "must": _json
            }
          },
          "sort": [
            {
              "release_year": {
                "order": "desc"
              }
            }
          ]
      }
    })

  
    var temp = [];
    result.hits.hits.forEach( (res) => {
      temp.push(res._source);
    })
    return res.send({
    status:true,
          data: temp
      });
  }catch(e) {
      console.log("Errr ",e.message)
      return res.send({status:false,data: []});  
  }
};


exports.getForyouV1 = async (req, res) => {
  try {
    console.log("exports.getForyouV1 ",req.query);
    let uniqueArray = []
    let uniqueIdArray = []
    let result = {};
      

    //SimailarMovies.find({_id:"5fa2a3fe2f074366b103c47a"})
    SimailarMovies.find({ movie_id : {"$in": ["5f8c6492919835824fa87788","5f8c6492919835824fa87789" ]} })
    //SimailarMovies.find({ movie_id : {"$in": [ req.query.id ]} })
    .then(movie => {
       console.log("Response ",movie)
        if(!movie || movie.length ==0) {
			    return res.send({
				    status: true,
				    data: []
		  	  });           
        }
      
      result.movie_title = movie[0].movie_title;
      result.primary_language = movie[0].primary_language;
      result.release_year = movie[0].release_year;
      result.genre = movie[0].genre;

      movie.forEach( row => {
        //console.log("row ",row.similar_movies)
        row.similar_movies =eval(row.similar_movies[0]);
        //[{'movie_id': '5f8c6492919835824fa8782c', 'movie_title': 'What a Difference a Day Made: Doris Day Superstar', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2009', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa87831', 'movie_title': 'Twilight in Forks: The Saga of the Real Town', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2009', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa87832', 'movie_title': '400 Years of the Telescope', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2009', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa8783b', 'movie_title': 'Krautrock : The Rebirth of Germany', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2009', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa8783e', 'movie_title': 'Into the Mind', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2013', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa87841', 'movie_title': 'Hank: 5 Years from the Brink', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2013', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa87846', 'movie_title': 'Space: Unraveling the Cosmos', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2014', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa87847', 'movie_title': 'Graphic Sexual Horror', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2009', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa8784d', 'movie_title': 'Return to Homs', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2013', 'relevance_score': 22.172823}, {'movie_id': '5f8c6492919835824fa8784f', 'movie_title': 'Pierce the Veil: This Is a Wasteland', 'genre': 'Documentary', 'primary_language': 'English', 'release_year': '2013', 'relevance_score': 22.172823}];
        row.similar_movies.forEach( row1 => {
          if(uniqueIdArray.indexOf(row1.movie_id)==-1) {
            uniqueArray.push(row1);
            uniqueIdArray.push(row1.movie_id)
          }
        })
      })
      result.similar_movies = uniqueArray;

      res.send({status:true, data: result});

    }).catch(err => {
      console.log("Errr ",err)
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
    
  }catch(e) {
      console.log("Errr ",e.message)
      return res.send({status:false,data: []});  
  }
};


/*
db.getCollection('sample_movies').find( {"movie_id": {
        "$in": [
            "5f8c6492919835824fa87788",
            "5f8c6492919835824fa87789"
        ]
    } })
/*
GET ott_movies/_search
{
  "query": {
    "match": {
      "language": "Hindi" 
    }
  }
}

GET ott_movies/_search
{
  "query": {
    "multi_match": {
      "query": "Hindi",
      "fields": ["title", "language^3", "genre^2"]
    }
  }
}

*/