const express = require('express');
const {addBook, getBooks, getBookById, updateBook, deleteBook} = require("../controllers/books.controller");
const {imageUpload} = require("../config/uploadConfig");
const router = express.Router()

router.post('/new', imageUpload.single('image') , addBook);

router.get('', getBooks);

router.get('/:bookId', getBookById);

router.put('/:bookId', imageUpload.single('image'), updateBook);

router.delete('/:bookId', deleteBook)

module.exports = router