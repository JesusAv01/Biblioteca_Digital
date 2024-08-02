async function loadBooks(search = '', genre = '', resultsPerPage = 6, page = 1) {
    try {
        const response = await fetch(`/api/books?search=${search}&genre=${genre}&resultsPerPage=${resultsPerPage}&page=${page}`);
        if (!response.ok) {
            notyf.open({
                type: 'error',
                message: 'Error al cargar los libros'
            });
            return;
        }
        const data = await response.json();

        const $container = $('#librosContainer');
        $container.empty();

        data.books.forEach(book => {
            const card = `
                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <img src="${book.imagePath}" class="card-img-top" alt="${book.title}" style="height: 200px; object-fit: cover;" data-id="${book._id}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text"><strong>Autor:</strong> ${book.author}</p>
                            <p class="card-text"><strong>ISBN:</strong> ${book.isbn}</p>
                            <p class="card-text"><strong>Género:</strong> ${book.genero}</p>
                            <p class="card-text"><strong>Año de Publicación:</strong> ${book.publishYear}</p>
                            <div class="d-flex justify-content-center mt-3">
                                <a href="#" class="btn btn-primary me-2 editBookBtn" data-id="${book._id}">
                                    <i class="fas fa-edit"></i> Editar
                                </a>
                                <button class="btn btn-danger deleteBookBtn" data-id="${book._id}">
                                    <i class="fas fa-trash-alt"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card);
        });

        const totalPages = data.totalPages;
        const $pagination = $('#paginacion');
        $pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
            $pagination.append(pageItem);
        }

        $('#infoResultados').text(`Mostrando ${data.books.length} resultados de ${data.totalResults}`);
    } catch (error) {
        console.error(error);
        notyf.open({
            type: 'error',
            message: 'Error al cargar los libros'
        });
    }
}

async function addBook() {
    try {
        const bookId = $('#libroId').val();
        const title = $('#titulo').val().trim();
        const author = $('#autor').val().trim();
        const isbn = $('#isbn').val().trim();
        const publishYear = $('#publishYear').val().trim();
        const genero = $('#genero').val().trim();
        const image = $('#imagen')[0].files[0];

        if (!title || !author || !isbn || !publishYear || !genero || (!image && !bookId)) {
            notyf.open({
                type: 'warning',
                message: 'Por favor, complete todos los campos antes de guardar el libro.'
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('isbn', isbn);
        formData.append('publishYear', publishYear);
        formData.append('genero', genero);
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(bookId ? `/api/books/${bookId}` : '/api/books/new', {
            method: bookId ? 'PUT' : 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            notyf.open({
                type: 'error',
                message: `Error: ${errorData.message || 'No se pudo guardar el libro'}`
            });
            return;
        }

        notyf.open({
            type: 'success',
            message: 'Libro guardado exitosamente'
        });

        $('#libroForm')[0].reset();
        $('#imagenPreview').attr('src', '');
        $('#imagenPreviewContainer').hide();
        $('#formularioLibro').hide();
        $('#listadoLibros').show();
        await loadBooks();
    } catch (error) {
        console.error(error);
        notyf.open({
            type: 'error',
            message: 'Error al guardar el libro'
        });
    }
}

async function editBookForm(bookId) {
    try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) {
            notyf.open({
                type: 'error',
                message: 'Error al obtener la información del libro'
            });
            return;
        }
        const book = await response.json();

        $('#libroId').val(book._id);
        $('#titulo').val(book.title);
        $('#autor').val(book.author);
        $('#isbn').val(book.isbn);
        $('#publishYear').val(book.publishYear);
        $('#genero').val(book.genero);
        $('#imagenPreview').attr('src', book.imagePath);
        $('#imagenPreviewContainer').show();

        $('#formularioLibro').show();
        $('#listadoLibros').hide();
    } catch (error) {
        console.error(error);
        notyf.open({
            type: 'error',
            message: 'Error al cargar la información del libro'
        });
    }
}

async function editBook() {
    try {
        const bookId = $('#libroId').val();
        if (!bookId) {
            notyf.open({
                type: 'warning',
                message: 'ID del libro no disponible para editar'
            });
            return;
        }

        const title = $('#titulo').val().trim();
        const author = $('#autor').val().trim();
        const isbn = $('#isbn').val().trim();
        const publishYear = $('#publishYear').val().trim();
        const genero = $('#genero').val().trim();
        const image = $('#imagen')[0].files[0];

        if (!title || !author || !isbn || !publishYear || !genero) {
            notyf.open({
                type: 'warning',
                message: 'Por favor, complete todos los campos antes de guardar el libro.'
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('isbn', isbn);
        formData.append('publishYear', publishYear);
        formData.append('genero', genero);
        if (image) {
            formData.append('image', image);
        }

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            notyf.open({
                type: 'error',
                message: `Error: ${errorData.message || 'No se pudo actualizar el libro'}`
            });
            return;
        }

        notyf.open({
            type: 'success',
            message: 'Libro actualizado exitosamente'
        });

        $('#libroForm')[0].reset();
        $('#imagenPreview').attr('src', '');
        $('#imagenPreviewContainer').hide();
        $('#formularioLibro').hide();
        $('#listadoLibros').show();
        await loadBooks();
    } catch (error) {
        console.error(error);
        notyf.open({
            type: 'error',
            message: 'Error al actualizar el libro'
        });
    }
}

async function deleteBook(bookId) {
    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            notyf.open({
                type: 'error',
                message: `Error: ${errorData.message || 'No se pudo eliminar el libro'}`
            });
            return;
        }

        notyf.open({
            type: 'success',
            message: 'Libro eliminado exitosamente'
        });
        await loadBooks();
    } catch (error) {
        console.error(error);
        notyf.open({
            type: 'error',
            message: 'Error al eliminar el libro'
        });
    }
}

$(async function () {
    // Función para realizar la búsqueda
    async function performSearch() {
        const search = $('#busqueda').val().trim();
        const genre = $('#filtroGenero').val();
        const resultsPerPage = $('#resultadosPorPagina').val();
        await loadBooks(search, genre, resultsPerPage);
    }

    // Cargar libros inicialmente
    await loadBooks();

    // Evento para el campo de búsqueda
    $('#busqueda').on('input', _.debounce(performSearch, 300));

    // Eventos para los selectores
    $('#filtroGenero, #resultadosPorPagina').on('change', performSearch);

    $(document).on('click', '.editBookBtn', function (e) {
        e.preventDefault();
        const bookId = $(this).data('id');
        if (bookId) {
            editBookForm(bookId);
        } else {
            notyf.open({
                type: 'error',
                message: 'ID del libro no disponible'
            });
        }
    });

    $(document).on('click', '.deleteBookBtn', function () {
        const bookId = $(this).data('id');
        deleteBook(bookId);
    });

    $('#paginacion').on('click', '.page-link', async function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        const search = $('#busqueda').val().trim();
        const genre = $('#filtroGenero').val();
        const resultsPerPage = $('#resultadosPorPagina').val();
        await loadBooks(search, genre, resultsPerPage, page);
    });

    $('#mostrarFormulario').click(function() {
        $('#formularioLibro').show();
        $('#listadoLibros').hide();
    });

    $('#regresarBtn').click(function() {
        $('#formularioLibro').hide();
        $('#listadoLibros').show();
        $('#libroForm')[0].reset();
        $('#imagenPreview').attr('src', '');
        $('#imagenPreviewContainer').hide();
    });

    $('#imagen').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagenPreview').attr('src', e.target.result);
                $('#imagenPreviewContainer').show();
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagenPreviewContainer').hide();
        }
    });

    $('#libroForm').on('submit', async function (e) {
        e.preventDefault();
        const bookId = $('#libroId').val();
        if (bookId) {
            await editBook();
        } else {
            await addBook();
        }
    });
});