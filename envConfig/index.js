//require('dotenv').config();
//if (process.env.NODE_ENV !== 'production') {
//  require('dotenv').config();
//}
var path = require('path');
const dotenv = require('dotenv');

console.log(" === ",process.env.NODE_ENV)
dotenv.config({
  path: path.resolve(__dirname+"/../envConfig", (process.env.NODE_ENV || 'development') + '.env')
});
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,
  MONGO_URI:process.env.MONGO_URI,
  ELASTIC_URI:process.env.ELASTIC_URI
}

console.log("env... ",process.env.NODE_ENV," === ",process.env.PORT)