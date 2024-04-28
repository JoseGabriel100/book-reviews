const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (users.length === 0) return true;

  return users.indexOf(username) === -1;
};

const authenticatedUser = (username, password) => {
  let user = users.find(
    (user) => user.username === username && user.password === password
  );

  return user ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!authenticatedUser(username, password))
    return res.status(403).json({ message: "User not authenticated" });

  let accessToken = jwt.sign(
    {
      data: {
        username,
        password,
      },
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken,
  };

  return res.json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.username;
  let review = req.query.review;

  let reviews = books[isbn].reviews;

  // add or update
  reviews[username] = review;

  res.json(reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.username;

  let reviews = books[isbn].reviews;

  delete reviews[username];

  res.json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
