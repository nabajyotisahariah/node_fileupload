
var client = require('./../config/elastic.config');

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
      //console.log("result ",result);
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

};

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