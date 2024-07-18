const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  try {
    let { username, password } = req.body;
    if(!username) {
      res.status(403).json({message: "Please send username"});
    }

    if(!password) {
      res.status(403).json({message: "Please send password"});
    }

    users.push({ username, password });

    return res.status(200).json({message: "User logged in successfully", data: []});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    return res.status(200).json({message: "Books got successfully", data: books});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try {
    let isbn = req["params"]["isbn"];
    if(books[isbn]) return res.status(200).json({message: "Books got successfully", data: books[isbn]});
    else return res.status(200).json({message: "There is no book regarding this ISBN !!", data: []});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    let author = req["params"]["author"], bookDetails;
    for(let key in books) {
      if(books[key]["author"] == author){
        bookDetails = books[key]
      }
    }
    if(bookDetails) return res.status(200).json({message: "Books got successfully", data: bookDetails});
    else return res.status(200).json({message: "There is no book regarding this Author !!", data: []});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    let title = req["params"]["title"], bookDetails;
    for(let key in books) {
      if(books[key]["title"] == title){
        bookDetails = books[key]
      }
    }
    if(bookDetails) return res.status(200).json({message: "Books got successfully", data: bookDetails});
    else return res.status(200).json({message: "There is no book regarding this Author !!", data: []});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    let isbn = req["params"]["isbn"];
    if(books[isbn]) return res.status(200).json({message: "Books got successfully", data: books[isbn]["reviews"]});
    else return res.status(200).json({message: "There is no book regarding this ISBN !!", data: []});
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

module.exports.general = public_users;
