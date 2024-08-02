const express = require('express');
const router = express.Router()
const resources = require('../public/js/cdnRecurses').website;


router.get("/", (req, res) => {
    res.render("index",{resources});
});




module.exports = router