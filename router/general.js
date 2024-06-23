const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//function to check if a user exists
function doesExist(username) {
  return users.some((user) => user.username === username);
}
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "registered" });
    } else {
      return res.status(404).json({ message: "already registered" });
    }
  }
  // Return error if username or password is missing
  return res
    .status(404)
    .json({ message: "Please provide username and password" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const getbook = () =>
    new Promise((resolve) => {
      setTimeout(resolve(Object.values(books)), 100);
    });

  const booksList = await getbook();

  // Send the formatted books list as the response
  return res.status(200).json({ message: "Books list", data: booksList });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbs = req.params.isbn;
  const getbook = () =>
    new Promise((resolve) => {
      setTimeout(resolve(books[isbs]), 100);
    });
  const booksbyibs = await getbook();
  if (booksbyibs) {
    return res.status(200).json({ message: "book", data: booksbyibs });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const getbook = () =>
    new Promise((resolve) => {
      setTimeout(
        resolve(
          Object.values(books).filter(
            (item) => item.author.toLowerCase() === author
          )
        )
      );
    });
  const book = await getbook();

  if (book.length > 0) {
    return res.status(200).json({ message: "book", book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const getbook = () =>
    new Promise((resolve) => {
      setTimeout(
        resolve(
          Object.values(books).filter(
            (item) => item.title.toLowerCase() === title
          )
        ),
        100
      );
    });
  const booksbytitle = await getbook();
  if (booksbytitle) {
    return res
      .status(300)
      .json({ message: "books by title", data: booksbytitle });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const booksbyibs = books[isbn];
  if (booksbyibs) {
    return res.status(200).json({ reviews: booksbyibs.reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
