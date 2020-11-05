var client = require('./../app/config/elastic.config');

client.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});

//Create index
client.indices.create({  
  index: 'blog'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});


/*
client.indices.delete({index: 'gov'},function(err,resp,status) {  
  console.log("delete",resp);
});
*/

/*client.index({  
    index: 'gov',
    id: '1',
    type: 'constituencies',
    body: {
      "ConstituencyName": "Ipswich",
      "ConstituencyID": "E14000761",
      "ConstituencyType": "Borough",
      "Electorate": 74499,
      "ValidVotes": 48694,
    }
  },function(err,resp,status) {
      console.log(resp);
  });*/

//Adding Documents to an Index
client.index({
    index: 'blog',
    id: '1',
    type: 'posts',
    body: {
        "PostName": "Integrating Elasticsearch Into Your Node.js Application",
        "PostType": "Tutorial",
        "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
    }
}, function(err, resp, status) {
    console.log(resp);
});

  /*client.count({index: 'gov',type: 'constituencies'},function(err,resp,status) {  
    console.log("constituencies",resp);
  });*/


  /*
  client.delete({  
  index: 'gov',
  id: '1',
  type: 'constituencies'
},function(err,resp,status) {
    console.log(resp);
});
*/

//var myBody = { index: {_index: 'gov', _type: 'constituencies', _id: '1' } },  
/*var myBody = [{               
                "ConstituencyName": "Ipswich",
                "ConstituencyID": "E14000761",
                "ConstituencyType": "Borough"
                
                }]


client.bulk({  
    index: 'gov',
    type: 'constituencies',
    body: myBody
    });               

*/
    client.search({  
        index: 'gov',
        type: 'constituencies',
        body: {
          query: {
            match: { "constituencyname": "Ipswich" }
          },
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
            console.log("--- Response ---");
            console.log(response);
            console.log("--- Hits ---");
            response.hits.hits.forEach(function(hit){
              console.log(hit);
            })
          }
      });

      client.indices.putMapping({  
        index: 'gov',
        type: 'constituencies',
        body: {
          properties: {
            'constituencyname': {
              'type': 'string', // type is a required attribute if index is specified
              'index': 'not_analyzed'
            },
          }
        }
      },function(err,resp,status){
          if (err) {
            console.log(err);
          }
          else {
            console.log(resp);
          }
      });