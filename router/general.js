const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log("username: ", username);
  console.log("password: ", password);

  if (!username) res.status(404).json({ message: "username empty" });
  if (!password) res.status(404).json({ message: "password empty" });
  if (!isValid(username))
    res.status(404).json({ message: "username already exists" });

  users.push({ username, password });

  console.log("registered users", users);

  res.send("User successfully registered");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = parseInt(req.params.isbn);
  res.json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let booksList = Object.values(books);
  let book = booksList.filter((book) => book.author === author);
  res.json(book);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let booksList = Object.values(books);
  let book = booksList.filter((book) => book.title === title);
  res.json(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = parseInt(req.params.isbn);
  let book = books[isbn];
  res.json(book.reviews);
});

const url = "http://localhost:5000";

async function getBooks() {
  axios
    .get(url)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

async function getBookByISBN(isbn) {
  // endpoint: /isbn/:isbn
  axios
    .get(`${url}/isbn/${isbn}`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

async function getBookByAuthor(author) {
  // endpoint: /author/:author
  axios
    .get(`${url}/author/${author}`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

async function getBookByTitle(title) {
  // title: /title/:title
  axios
    .get(`${url}/title/${title}`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

module.exports.general = public_users;
