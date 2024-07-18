const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let users = require("./router/auth_users.js").users;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(req.session)
    let token = req.session.accessToken;
    if(!token) return res.status(401).json({ message: "Please send token ", data: [] });
    jwt.verify(token, 'shhhhh', function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: "User is unauthorised", data: [] })
        }
        else {
            let { username, password } = decoded, user = users.find(e => (e.username == username && e.password == password));
            if (user) {
                req.body.username = username;
                req.body.password = password;
                next();
            }
            else {
                return res.status(401).json({ message: "User is unauthorised", data: [] })
            }
        }
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on -->> ", PORT));