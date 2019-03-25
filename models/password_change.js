const mongoose = require('mongoose')
const crypto = require('crypto');

const schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    link: String
}, {
    timestamps: true
})

schema.methods.generateLink = function () {
    this.link = crypto.randomBytes(32).toString('hex')
}
schema.methods.isExpired = function () {
    const now = new Date();
    const createDate = new Date(this.createDate)
    const diffMins = Math.round(((Math.abs(now - createDate) % 86400000) % 3600000) / 60000);

    // valid for only 10 minutes
    return diffMins > 15;
}

module.exports = mongoose.model('passwordChange', schema);