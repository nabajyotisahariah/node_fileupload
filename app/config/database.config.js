//module.exports = {
//    url: 'mongodb://localhost:27017/ottwatch'
//}

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = 'mongodb://localhost:27017/db'

// Connecting to the database
mongoose.connect( url,  {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
     console.log("Successfully connected to the database");    
}).catch(err => {
     console.log('Could not connect to the database. Exiting now...', err);
     process.exit();
});
