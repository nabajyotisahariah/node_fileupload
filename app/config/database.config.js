const mongoose = require('mongoose');
//const tunnel = require('tunnel-ssh');

const movies = require('./../models/movie.model');
const config = require("../../envConfig");

mongoose.Promise = global.Promise;

const url = config.MONGO_URI;//'mongodb://localhost:27017/db'

// Connecting to the database
mongoose.connect( url,  {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
     console.log("Successfully connected to the database");    
}).catch(err => {
     console.log('Could not connect to the database. Exiting now...', err);
     process.exit();
});


/*var config = {
     username : 'R200602',
     host: '10.140.64.229',
     port:22,
     password:'R200602',
     dstPort:27017,
     localHost: 'localhost',
     localPort:27017
 };
     
 console.log(tunnel);
 var server = tunnel(config, function (error, server) {
     
     if(error){
         console.log("SSH connection error: " + error);
     }
     console.log(server);
     mongoose.connect('mongodb://localhost:27017/demo',  {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
          console.log("Successfully connected to the database");   
          try {
               console.log("movies ",movies)
               movies.find({}).limit(10).then(_res => {    
                    console.log("Res ",_res)
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

          } catch(e) {
               console.log("Error ",e.message)
          }
     }).catch(err => {
          console.log('Could not connect to the database. Exiting now...', err);
          process.exit();
     });
   
 });*/
