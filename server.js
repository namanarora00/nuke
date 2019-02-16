const express = require('express')

app = express();

app.get('/', (req, res) => {
    res.send("<h1>Hello, We'll be making RESTFul APIs so this won't be used</h1>");
});

const port = process.env.PORT || 5000;
app.listen(port, 'localhost')