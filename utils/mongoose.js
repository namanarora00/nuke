const mongoose = require('mongoose');

function connect(callback) {

    if (process.env.NODE_ENV === 'production') {
        var url = "mongodb+srv://naman:namanpassword@cluster0-sqrrq.mongodb.net/nuke?retryWrites=true"
    } else {
        url = "mongodb://127.0.0.1:27017/nuke"
    }

    mongoose.connect(url, {
            useNewUrlParser: true
        })
        .then(() => {
            console.log("connected")
            if (callback) callback(null, "Nuke");
        })
        .catch(err => {
            callback(err)
        });
    //mongoose.set('debug', true);
}

module.exports = connect;