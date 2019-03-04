const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const dbName = 'nuke';

function connect(callback) {

    mongoose.connect(`mongodb://${server}/${dbName}`, {
            useNewUrlParser: true
        })
        .then(() => {
            if (callback) callback(null, dbName);
        })
        .catch(err => {
            callback(err)
        });
    //mongoose.set('debug', true);
}

module.exports = connect;