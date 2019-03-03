const express = require('express');
const connect = require('./utils/mongoose');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();

// connect to database
connect((err, name) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected to database " + name);
    }
});

// logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.ip}`);
    next();
});

// cors
app.use(cors());

// post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// static
app.use('/static', express.static('public'));

// routes
app.use('/user', users)

// 404
app.use((req, res, next) => {
    return res.status(404).json({
        message: "Couldn't find the resource",
        url: req.url
    });
});

const port = process.env.PORT || 8000;
app.listen(port, 'localhost');