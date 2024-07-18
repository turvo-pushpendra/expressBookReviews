const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

let token = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username) {
      res.status(403).json({ message: "Please send username", data: [] });
    }

    if (!password) {
      res.status(403).json({ message: "Please send password", data: [] });
    }

    let currentUser = users.find(e => e.username == username);

    if (currentUser) {
      if (currentUser.username == username && currentUser.password == password) {
        var jwtToken = jwt.sign({ username, password }, 'shhhhh');
        token.push(jwtToken);
        req.session.accessToken = jwtToken;
        return res.status(200).send({ message: "User successully logged in", data: [] });
      }
      else {
        return res.status(401).json({ message: "Unauthorised user", data: [] });
      }
    }
    else {
      return res.status(401).json({ message: "User does not exists", data: [] });
    }
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error !!" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    let { username, password, review } = req.body, isbn = req["params"]["isbn"];
    
    if(!books[isbn]) return res.status(403).json({message: "There is no book regarding this ISBN !!", data: []});
    else {
      books[isbn]['reviews'][username] = review;
      return res.status(200).json({message: "Review updated successfully", data: []});
    }
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    let { username, password } = req.body, isbn = req["params"]["isbn"];
    
    if(!books[isbn]) return res.status(403).json({message: "There is no book regarding this ISBN !!", data: []});
    if(!books[isbn]['reviews'][username]) return res.status(403).json({message: "There is no review regarding this user !!", data: []});
    else {
      delete books[isbn]['reviews'][username];
      return res.status(200).json({message: "Review deleted successfully", data: []});
    }
  }
  catch(err) {
    return res.status(500).json({message: "Internal server error !!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
