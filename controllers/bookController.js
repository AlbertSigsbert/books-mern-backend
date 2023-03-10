const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

//Get all books(with pagination)
// const pageLimit = 10;
// const getBooks = asyncHandler(async (req, res) => {
//   const books = await Book.find().sort({ createdAt: -1 }).lean();
//   if (!books?.length) {
//     return res.status(400).json({ message: "No books found" });
//   }
//   res.status(200).json({
//     "books":books.slice(-pageLimit),
//     "page": 1,
//     "pageCount": Math.ceil (books.length / 10)
//   });
// });

const getBooks = asyncHandler(async (req, res) => {
  // Get page and limit parameters from query string
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Get total number of books from database
  const count = await Book.countDocuments();

  // Calculate the number of pages
  const pages = Math.ceil(count / limit);

  // Check if page is valid
  if (page > pages) {
    res.status(404).json({ message: 'Page not found' });
    return;
  }

  // Get books from database with pagination
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit);

  // Send response with books, page, limit and pages
  res.status(200).json({ books, page, limit, pages });
});

//Create book
const createBook = asyncHandler(async (req, res) => {
  const { title, price, cover, authors, categories } = req.body;

  const book = new Book({ title, price, cover, authors, categories });

  await book.save();

  res.status(201).json({ message: "Book created successfully", data: book });
});

//update a book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Book Id" });
  }

  const book = await Book.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!book) {
    return res.status(404).json({ message: "Book Not Found" });
  }

  res.status(200).json(book);
});

//delete a book
const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Book Id" });
    }
  
    const book = await Book.findOneAndDelete({ _id: id });
  
    if (!book) {
      return res.status(404).json({ message: "Book Not Found" });
    }
  
    res.status(200).json(book);
});

//Get popular books
const popularBooks = asyncHandler(async function(req, res) {
    // Find all books and sort them by likes in descending order
    const books = await Book.find().sort({likes: -1});
    // Send response with books array
    res.status(200).json({
        "books":books.slice (-pageLimit),
        "page": 1,
        "pageCount": Math.ceil (books.length / 10)
      });
  });

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  popularBooks
};
