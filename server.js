const express = require('express');
const connect = require('./utils/mongoose');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

var app = express();

// connect to database
connect((err, name) => {
    if (err) {
        console.log("error")
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
app.use('/api/user', users)

// set a static folder
// SHOULD BE USED ONLY FOR PRODUCTION
app.use(express.static(path.join(__dirname, "frontend", "build")))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});


// 404
app.use((req, res, next) => {
    return res.status(404).json({
        message: "Couldn't find the resource",
        url: req.url
    });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("starting server")
});