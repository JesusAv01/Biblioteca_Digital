const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishYear: { type: Number, required: true },
    isbn: { type: String, unique: true },
    genero: { type: String, required: true },
    imagePath: { type: String, required: true }
}, { timestamps: true });


bookSchema.index({ title: 1, author: 1 }, { unique: true });
bookSchema.index({ isbn: 1 }, { unique: true });


module.exports = mongoose.model('Book', bookSchema);