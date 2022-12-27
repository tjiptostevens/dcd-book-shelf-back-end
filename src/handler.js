const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    // error name
    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    // error readPage > pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    // push book into array
    books.push(newBook);

    // check if insert to array success
    const isSuccess = books.filter((d) => d.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query

    // check reading
    if (reading) {
        let read = reading === "1" ? true : false

        const book = books.filter((n) => n.reading === read).map((d) => ({ "id": d.id, "name": d.name, "publisher": d.publisher }));
        const response = h.response({
            status: "success",
            data: {
                books: book,
            },
        });
        response.code(200);
        return response;
    }
    // check finished
    if (finished) {
        let read = finished === "1" ? true : false

        const book = books.filter((n) => n.finished === read).map((d) => ({ "id": d.id, "name": d.name, "publisher": d.publisher }));
        const response = h.response({
            status: "success",
            data: {
                books: book,
            },
        });
        response.code(200);
        return response;
    }
    // check name
    if (name) {
        const book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase())).map((d) => ({ "id": d.id, "name": d.name, "publisher": d.publisher }));
        const response = h.response({
            status: "success",
            data: {
                books: book,
            },
        });
        response.code(200);
        return response;
    }
    const isEmpty = books.length > 0;
    if (!isEmpty) {
        const response = h.response({
            status: "success",
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    } else {
        const book = books.map((d) => ({ "id": d.id, "name": d.name, "publisher": d.publisher }));
        const response = h.response({
            status: "success",
            data: {
                books: book,
            },
        });
        response.code(200);
        return response;
    }

};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: "success",
            data: {
                book: book,
            },
        };
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    // error readPage > pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((d) => d.id === bookId);

    if (index !== -1) {

        if (name) {
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt,
            };

            const response = h.response({
                status: "success",
                message: "Buku berhasil diperbarui",
            });
            response.code(200);
            return response;
        } else {
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku",
            });
            response.code(400);
            return response;
        }
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((d) => d.id === bookId);

    console.log(books[index], index)
    if (index === 0) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;

    } else {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }


};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};