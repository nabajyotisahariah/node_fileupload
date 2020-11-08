var elasticsearch=require('elasticsearch');
const config = require("../../envConfig");

var client = new elasticsearch.Client( {  
  hosts: [
    //'https://[username]:[password]@[server]:[port]/',
    //'http://10.140.64.229:9200/'
    config.ELASTIC_URI
  ]
});

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

module.exports = client;