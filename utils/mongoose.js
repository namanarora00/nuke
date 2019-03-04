const mongoose = require('mongoose');

function connect(callback) {

    mongoose.connect(`mongodb+srv://naman:namanpassword@cluster0-sqrrq.mongodb.net/nuke?retryWrites=true`, {
            useNewUrlParser: true
        })
        .then(() => {
            console.log("connected")
            if (callback) callback(null, dbName);
        })
        .catch(err => {
            callback(err)
        });
    //mongoose.set('debug', true);
}

module.exports = connect;