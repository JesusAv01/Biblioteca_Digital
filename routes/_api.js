const express = require('express');
const router = express.Router()


router.use('/books',require('./book.routes'))



module.exports = router