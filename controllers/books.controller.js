const path = require('path');
const fs = require('fs');
const Book = require('../models/book.model');

module.exports = {
    addBook: async (req, res) => {
        try {
            const { title, author, publishYear, isbn, description, genero } = req.body;
            const imagePath = req.file ? path.join('uploads', 'images', req.file.filename) : null;

            // Verificar si ya existe un libro con el mismo título y autor
            const existingBookByTitleAndAuthor = await Book.findOne({ title, author });
            if (existingBookByTitleAndAuthor) {
                return res.status(400).json({
                    message: "Ya existe un libro con este título y autor"
                });
            }

            // Verificar si ya existe un libro con el mismo ISBN
            const existingBookByISBN = await Book.findOne({ isbn });
            if (existingBookByISBN) {
                return res.status(400).json({
                    message: "Ya existe un libro con este ISBN"
                });
            }

            // Si no existen duplicados, crear el nuevo libro
            const newBook = new Book({
                title,
                author,
                publishYear,
                isbn,
                description,
                imagePath,
                genero
            });

            const savedBook = await newBook.save();

            res.status(201).json({
                message: "Libro agregado exitosamente",
                book: savedBook
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al agregar el libro",
                error: error.message
            });
        }
    },

    getBooks: async (req, res) => {
        try {
            const { search, genre, resultsPerPage = 6, page = 1 } = req.query;
            const query = {};

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                    { isbn: { $regex: search, $options: 'i' } }
                ];
            }

            if (genre) {
                query.genero = genre;
            }

            const totalResults = await Book.countDocuments(query);
            const totalPages = Math.ceil(totalResults / resultsPerPage);
            const books = await Book.find(query)
                .skip((page - 1) * resultsPerPage)
                .limit(parseInt(resultsPerPage))
                .exec();

            res.json({
                books,
                totalResults,
                totalPages
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los libros' });
        }
    },

    getBookById: async (req, res) => {
        try {
            const { bookId } = req.params;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({
                    message: "Libro no encontrado"
                });
            }

            res.json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al obtener el libro",
                error: error.message
            });
        }
    },

    updateBook: async (req, res) => {
        try {
            const { bookId } = req.params;
            const { title, author, publishYear, isbn, description, genero } = req.body;
            const newImagePath = req.file ? path.join('uploads', 'images', req.file.filename) : null;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({
                    message: "Libro no encontrado"
                });
            }

            // Verificar si ya existe un libro con el mismo título y autor, excluyendo el libro actual
            const existingBookByTitleAndAuthor = await Book.findOne({ title, author, _id: { $ne: bookId } });
            if (existingBookByTitleAndAuthor) {
                return res.status(400).json({
                    message: "Ya existe un libro con este título y autor"
                });
            }

            // Verificar si ya existe un libro con el mismo ISBN, excluyendo el libro actual
            const existingBookByISBN = await Book.findOne({ isbn, _id: { $ne: bookId } });
            if (existingBookByISBN) {
                return res.status(400).json({
                    message: "Ya existe un libro con este ISBN"
                });
            }

            // Guardar la ruta anterior de la imagen
            const oldImagePath = book.imagePath;

            // Actualizar solo los campos que han sido proporcionados
            if (title !== undefined) book.title = title;
            if (author !== undefined) book.author = author;
            if (publishYear !== undefined) book.publishYear = publishYear;
            if (isbn !== undefined) book.isbn = isbn;
            if (description !== undefined) book.description = description;
            if (genero !== undefined) book.genero = genero;

            // Si se proporciona una nueva imagen, actualizar la ruta de la imagen
            if (newImagePath) {
                book.imagePath = newImagePath;
            } else if (isbn !== undefined) {
                // Cambiar el nombre del archivo de la imagen si se actualiza el ISBN y no se proporciona una nueva imagen
                const oldImageDir = path.dirname(oldImagePath);
                const oldImageExt = path.extname(oldImagePath);
                const newImageName = `${isbn}${oldImageExt}`;
                const newImagePath = path.join(oldImageDir, newImageName);

                // Renombrar el archivo de imagen
                fs.renameSync(oldImagePath, newImagePath);

                // Actualizar la ruta de la imagen en la base de datos
                book.imagePath = newImagePath;
            }

            const updatedBook = await book.save();

            res.json({
                message: "Libro actualizado exitosamente",
                book: updatedBook
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al actualizar el libro",
                error: error.message
            });
        }
    },

    deleteBook: async (req, res) => {
        try {
            const { bookId } = req.params;
            console.log(bookId)
            const book = await Book.findByIdAndDelete(bookId);
            if (!book) {
                return res.status(404).json({
                    message: "Libro no encontrado"
                });
            }

            // Eliminar la imagen del directorio
            if (book.imagePath) {
                fs.unlinkSync(path.resolve(book.imagePath));
            }

            res.json({
                message: "Libro eliminado exitosamente"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al eliminar el libro",
                error: error.message
            });
        }
    }
};
