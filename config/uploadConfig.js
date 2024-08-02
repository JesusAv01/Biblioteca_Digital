const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configuración de Multer para imágenes
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadFolder = path.join(__dirname, '..', 'uploads', 'images');

        // Verificar si el directorio existe y crearlo si no existe
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        const isbn = req.body.isbn;
        const fileExtension = path.extname(file.originalname);
        cb(null, `${isbn}${fileExtension}`);
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            console.log('Solo se admiten archivos de formato PNG, JPG o JPEG');
            cb(null, false);
        }
    },
});

module.exports = {
    imageUpload
};
