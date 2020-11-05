var express = require('express');
var router = express.Router();

var search = require('../app/controllers/search.controller');
console.log("search ",search)

// Retrieve a single Note with noteId
router.get('/reco/:key', search.getSearch);


module.exports = router;
