var client = require('./../app/config/elastic.config');

client.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});

//Create index
/*client.indices.create({  
  index: 'blog'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});*/


//Adding Documents to an Index
client.index({
    index: 'blog',
    //id: '4',
    type: 'posts',
    body: {
        "PostName": "Integrating Elasticsearch Into Your Node.js Application 2",
        "PostType": "Tutorial 2",
        "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application 2.",
    }
}, function(err, resp, status) {
    console.log("Adding index > ",resp);
    
});

//Search Documents Using Query Params
client.search({
    index: 'blog',
    type: 'posts',
    q: 'PostName:Node.js'
}).then(function(resp) {
    console.log("Search > ",resp);
    resp.hits.map( rows => {
        console.log("Search1 > ",row);
    })
}, function(err) {
    console.trace("Search error > ",err.message);
});

//Elasticsearch Query DSL
client.search({
    index: 'blog',
    type: 'posts',
    body: {
        query: {
            match: {
                "PostName": 'Node.js'
            }
        }
    }
}).then(function(resp) {
    console.log("Search 2> ",resp);
}, function(err) {
    console.trace(err.message);
});

/*
//promise API
const result =  client.search({
    index: 'blog',
    from: 0,
    size: 10,
    body: { PostName: 'Node' }
  }, {
    ignore: [404],
    maxRetries: 3
  })
  console.log("promise API ",result)
*/
  // callback API
client.search({
    index: 'blog',
    from: 0,
    size: 10,
    body: { PostName: 'Node.js' }
  }, {
    ignore: [404],
    maxRetries: 3
  }, (err, result) => {
    if (err) console.log(err)
   // console.log("result ",result)
  })